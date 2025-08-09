const express = require('express');
const { studentRegistration, teacherRegistration, login, logout } = require('../controllers/auth');

const router = express.Router();

// Student registration
// POST /api/auth/register/student
router.post('/register/student', studentRegistration);

// Teacher registration
// POST /api/auth/register/teacher
router.post('/register/teacher', teacherRegistration);

// Login (role required in body: 'student' | 'teacher')
// POST /api/auth/login
router.post('/login', login);

// Logout (Authorization: Bearer <token>)
// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router; 