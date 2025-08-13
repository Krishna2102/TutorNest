const express = require('express');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');

const router = express.Router();

// GET /api/teachers
router.get('/teachers', async (req, res) => {
  try {
    const { subject, minRate, maxRate } = req.query;
    const filter = {};
    if (subject) filter.subjectsTaught = { $in: [subject] };
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    const teachers = await Teacher.find(filter).select('-password');
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/teachers/:id
router.get('/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(400).json({ error: 'Invalid teacher id' });
  }
});

// GET /api/students/:id
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('_id fullName email avatarUrl');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: 'Invalid student id' });
  }
});

module.exports = router;
