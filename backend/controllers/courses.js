const Course = require("../models/coursesModel");

// Create a new course (Teacher only)
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      fullDescription,
      category,
      level,
      duration,
      price, 
      image,
      videos,
      syllabus,
      requirements,
      outcomes
    } = req.body;

    const course = await Course.create({
      title,
      description,
      fullDescription,
      category,
      level,
      duration,
      price,
      image,
      teacher: req.user.id,
      videos: videos || [],
      syllabus: syllabus || [],
      requirements: requirements || [],
      outcomes: outcomes || []
    });

    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all courses (Public)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "fullName email")
      .select("-studentsEnrolled");
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Enroll student to a course
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.studentsEnrolled.includes(req.user.id)) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    course.studentsEnrolled.push(req.user.id);
    await course.save();

    res.json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get course videos (Only for enrolled students)
const getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'fullName email');
    
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (!course.studentsEnrolled.includes(req.user.id)) {
      return res.status(403).json({ error: "You must be enrolled to access this course" });
    }

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get teacher's courses
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id })
      .populate('teacher', 'fullName email');
    
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get student's enrolled courses
const getStudentCourses = async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate('teacher', 'fullName email');
    
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update course (Teacher only)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teacher', 'fullName email');

    res.json({ success: true, course: updatedCourse });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete course (Teacher only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getCourseContent,
  getTeacherCourses,
  getStudentCourses,
  updateCourse,
  deleteCourse
};
