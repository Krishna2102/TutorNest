const validator = require('validator');
const jwt = require('jsonwebtoken');

const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

// In-memory token blacklist (process lifetime)
const tokenBlacklist = new Set();

const getJwtSecret = () => process.env.JWT_SECRET || process.env.TOKEN_KEY || 'dev-secret';
const TOKEN_EXPIRES_IN = '30d';

const signToken = (payload) => jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRES_IN });

const sanitizeStudent = (s) => ({
  id: s._id,
  role: 'student',
  fullName: s.fullName,
  email: s.email,
  phone: s.phone,
  dateOfBirth: s.dateOfBirth,
  location: s.location,
  educationLevel: s.educationLevel,
  class: s.class,
  degree: s.degree,
  schoolName: s.schoolName,
  universityName: s.universityName,
  institution: s.institution,
  preferredSubjects: s.preferredSubjects,
  avatarUrl: s.avatarUrl,
  isEmailVerified: s.isEmailVerified,
  createdAt: s.createdAt,
});

const sanitizeTeacher = (t) => ({
  id: t._id,
  role: 'teacher',
  fullName: t.fullName,
  email: t.email,
  phone: t.phone,
  profilePictureUrl: t.profilePictureUrl,
  qualification: t.qualification,
  experienceYears: t.experienceYears,
  subjectsTaught: t.subjectsTaught,
  hourlyRate: t.hourlyRate,
  resumeUrl: t.resumeUrl,
  verificationDocs: t.verificationDocs,
  rating: t.rating,
  totalReviews: t.totalReviews,
  isEmailVerified: t.isEmailVerified,
  isVerifiedByAdmin: t.isVerifiedByAdmin,
  createdAt: t.createdAt,
});

// POST /api/auth/register/student
const studentRegistration = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone, // optional
      dateOfBirth, // ISO or yyyy-mm-dd
      location,
      educationLevel,
      class: classGrade,
      degree,
      schoolName,
      universityName,
      institution,
      preferredSubjects, // array of strings
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Ensure email is unique across both collections
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    if (existingStudent || existingTeacher) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const student = new Student({
      fullName,
      email,
      password, // hashed by pre-save hook
      phone: phone || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      location: location || '',
      educationLevel: educationLevel || 'school',
      class: classGrade || '',
      degree: degree || '',
      schoolName: schoolName || '',
      universityName: universityName || '',
      institution: institution || '',
      preferredSubjects: Array.isArray(preferredSubjects) ? preferredSubjects : [],
    });

    await student.save();

    const token = signToken({ userId: student._id, role: 'student' });
    return res.status(201).json({ token, user: sanitizeStudent(student) });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('studentRegistration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/register/teacher
const teacherRegistration = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone, // required
      qualification,
      experienceYears,
      subjectsTaught,
      hourlyRate,
      profilePictureUrl, // if using file upload, replace with uploaded URL
      resumeUrl,
      verificationDocs, // array of URLs
    } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ error: 'fullName, email, password and phone are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Unique email across both collections
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    if (existingStudent || existingTeacher) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const teacher = new Teacher({
      fullName,
      email,
      password, // hashed by pre-save hook
      phone,
      qualification: qualification || '',
      experienceYears: Number(experienceYears) || 0,
      subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : [],
      hourlyRate: Number(hourlyRate) || 0,
      profilePictureUrl: profilePictureUrl || '',
      resumeUrl: resumeUrl || '',
      verificationDocs: Array.isArray(verificationDocs) ? verificationDocs : [],
    });

    await teacher.save();

    const token = signToken({ userId: teacher._id, role: 'teacher' });
    return res.status(201).json({ token, user: sanitizeTeacher(teacher) });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('teacherRegistration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/login
// Body: { email, password, role: 'student' | 'teacher' }
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const Model = role === 'student' ? Student : Teacher;
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ userId: user._id, role });
    const sanitized = role === 'student' ? sanitizeStudent(user) : sanitizeTeacher(user);

    return res.status(200).json({ token, user: sanitized });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/logout
// Header: Authorization: Bearer <token>
const logout = async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // Optionally verify to extract exp for TTL management; here we just store the token
    tokenBlacklist.add(token);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  studentRegistration,
  teacherRegistration,
  login,
  logout,
  tokenBlacklist,
};