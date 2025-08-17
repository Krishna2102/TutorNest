const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const { tokenBlacklist } = require('../controllers/auth');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token is blacklisted
    if (tokenBlacklist && tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.TOKEN_KEY || 'dev-secret');
    console.log('Decoded token:', decoded);
    
    // Try to find user in both Student and Teacher collections
    let user = await Student.findById(decoded.userId).select('-password');
    console.log('Student found:', !!user);
    if (!user) {
      user = await Teacher.findById(decoded.userId).select('-password');
      console.log('Teacher found:', !!user);
    }
    
    if (!user) {
      console.log('No user found for userId:', decoded.userId);
      return res.status(401).json({ message: 'Token is not valid - user not found' });
    }

    console.log('User found:', user.fullName, user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid - verification failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Verify teacher middleware
const verifyTeacher = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token is blacklisted
    if (tokenBlacklist && tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.TOKEN_KEY || 'dev-secret');
    
    const teacher = await Teacher.findById(decoded.userId).select('-password');
    
    if (!teacher) {
      return res.status(403).json({ message: 'Access denied. Teachers only.' });
    }

    req.user = teacher;
    req.user.role = 'teacher';
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Verify student middleware
const verifyStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token is blacklisted
    if (tokenBlacklist && tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.TOKEN_KEY || 'dev-secret');
    
    const student = await Student.findById(decoded.userId).select('-password');
    
    if (!student) {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    req.user = student;
    req.user.role = 'student';
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, authorize, verifyTeacher, verifyStudent };
