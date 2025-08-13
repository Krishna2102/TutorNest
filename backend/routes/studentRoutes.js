const express = require('express');
const { studentAuth } = require('../middleware/studentAuth');
const { getProfile, updateProfile, deleteProfile, listTeachers, rateTeacher, getStudentById } = require('../controllers/student');

const router = express.Router();

router.use(studentAuth);

// Profile
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteProfile);

// Teachers
router.get('/teachers', listTeachers);
router.post('/teachers/:id/rate', rateTeacher);

// GET /api/student/:id
router.get('/:id', getStudentById);

// GET /api/student/upcoming-sessions - Get upcoming sessions
router.get('/upcoming-sessions', async (req, res) => {
  try {
    // Mock data for now - replace with actual booking/session logic
    const upcomingSessions = [
      { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-20', time: '15:00', duration: '60 min' },
      { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-22', time: '16:30', duration: '45 min' },
    ];
    res.status(200).json(upcomingSessions);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/student/past-classes - Get past classes
router.get('/past-classes', async (req, res) => {
  try {
    // Mock data for now - replace with actual booking/session logic
    const pastClasses = [
      { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-15', duration: '60 min', status: 'completed' },
      { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-10', duration: '45 min', status: 'completed' },
      { id: 3, subject: 'Physics', teacher: 'Mr. Daniel', date: '2024-01-05', duration: '90 min', status: 'completed' },
    ];
    res.status(200).json(pastClasses);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

