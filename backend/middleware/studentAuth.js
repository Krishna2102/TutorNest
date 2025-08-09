const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const { tokenBlacklist } = require('../controllers/auth');

const getJwtSecret = () => process.env.JWT_SECRET || process.env.TOKEN_KEY || 'dev-secret';

const studentAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (tokenBlacklist && tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || decoded.role !== 'student') {
      return res.status(403).json({ error: 'Forbidden: students only' });
    }

    const student = await Student.findById(decoded.userId);
    if (!student) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.student = student;
    req.user = { id: decoded.userId, role: 'student' };
    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('studentAuth error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { studentAuth };
