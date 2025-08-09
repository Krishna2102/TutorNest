const express = require('express');
const { studentAuth } = require('../middleware/studentAuth');
const { getProfile, updateProfile, deleteProfile, listTeachers, rateTeacher } = require('../controllers/student');

const router = express.Router();

router.use(studentAuth);

// Profile
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteProfile);

// Teachers
router.get('/teachers', listTeachers);
router.post('/teachers/:id/rate', rateTeacher);

module.exports = router;
