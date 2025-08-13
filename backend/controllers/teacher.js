// GET /api/teachers/:id - public teacher info by ID
exports.getTeacherById = async (req, res) => {
	try {
		const teacher = await require('../models/teacherModel').findById(req.params.id).select('-password');
		if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
		res.json(teacher);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch teacher' });
	}
};

const Teacher = require('../models/teacherModel');

// GET /api/teachers - fetch all teachers
exports.getAllTeachers = async (req, res) => {
	try {
		const teachers = await Teacher.find({}, '-password'); // exclude password
		res.json(teachers);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch teachers' });
	}
};

