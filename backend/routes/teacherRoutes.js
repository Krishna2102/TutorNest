
const express = require('express');
const Teacher = require('../models/teacherModel');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/teacher/me - Get teacher profile
router.get('/me', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/teacher/me - Update teacher profile
router.put('/me', auth, async (req, res) => {
  try {
    const { headline, bio, subjectsTaught, hourlyRate } = req.body;
    
    const teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { headline, bio, subjectsTaught, hourlyRate },
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/teacher/upcoming-sessions - Get upcoming sessions
router.get('/upcoming-sessions', auth, async (req, res) => {
  try {
    // Mock data for now - replace with actual booking/session logic
    const upcomingSessions = [
      { id: 1, student: 'Aisha', subject: 'Mathematics', date: '2024-01-20', time: '15:00', duration: '60 min' },
      { id: 2, student: 'Daniel', subject: 'Physics', date: '2024-01-22', time: '16:30', duration: '90 min' },
    ];
    res.status(200).json(upcomingSessions);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/teacher/teaching-history - Get teaching history
router.get('/teaching-history', auth, async (req, res) => {
  try {
    // Mock data for now - replace with actual booking/session logic
    const teachingHistory = [
      { id: 1, student: 'Aisha', subject: 'Mathematics', date: '2024-01-15', duration: '60 min', status: 'completed' },
      { id: 2, student: 'Daniel', subject: 'Physics', date: '2024-01-12', duration: '90 min', status: 'completed' },
      { id: 3, student: 'Rina', subject: 'Mathematics', date: '2024-01-10', duration: '45 min', status: 'completed' },
    ];
    res.status(200).json(teachingHistory);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
