// GET /api/student/:id - public student info by ID
const getStudentById = async (req, res) => {
  try {
    const student = await require('../models/studentModel').findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

// GET /api/student/me
const getProfile = async (req, res) => {
  try {
    const s = req.student;
    return res.status(200).json({
      id: s._id,
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
      createdAt: s.createdAt,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getProfile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/student/me
const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowed = [
      'fullName', 
      'phone', 
      'dateOfBirth', 
      'location', 
      'educationLevel',
      'class',
      'degree',
      'schoolName',
      'universityName',
      'institution',
      'preferredSubjects', 
      'avatarUrl'
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.dateOfBirth) updates.dateOfBirth = new Date(updates.dateOfBirth);

    const updated = await Student.findByIdAndUpdate(req.student._id, updates, { new: true });
    return res.status(200).json(updated);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('updateProfile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/student/me
const deleteProfile = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.student._id);
    return res.status(200).json({ message: 'Profile deleted' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('deleteProfile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/student/teachers
const listTeachers = async (req, res) => {
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
    return res.status(200).json(teachers);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('listTeachers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/student/teachers/:id/rate
const rateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body; // 1..5

    const value = Number(rating);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: 'rating must be between 1 and 5' });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    // Simple average update: newAvg = (oldAvg*total + value) / (total+1)
    const newTotal = (teacher.totalReviews || 0) + 1;
    const newRating = (((teacher.rating || 0) * (newTotal - 1)) + value) / newTotal;
    teacher.totalReviews = newTotal;
    teacher.rating = Math.round(newRating * 10) / 10; // one decimal
    await teacher.save();

    return res.status(200).json({ rating: teacher.rating, totalReviews: teacher.totalReviews });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('rateTeacher error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  listTeachers,
  rateTeacher,
   getStudentById,
};
