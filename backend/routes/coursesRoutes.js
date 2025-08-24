const express = require("express");
const {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getCourseContent,
  getTeacherCourses,
  getStudentCourses,
  updateCourse,
  deleteCourse,
  unenrollFromCourse
} = require("../controllers/courses");

const { verifyTeacher, verifyStudent } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllCourses);

// Teacher routes
router.post("/", verifyTeacher, createCourse);
router.get("/teacher/courses", verifyTeacher, getTeacherCourses);
router.put("/:id", verifyTeacher, updateCourse);
router.delete("/:id", verifyTeacher, deleteCourse);

// Student routes
router.get("/student/courses", verifyStudent, getStudentCourses);
router.post("/:id/enroll", verifyStudent, enrollInCourse);
router.delete("/:id/unenroll", verifyStudent, unenrollFromCourse);
router.get("/:id/content", verifyStudent, getCourseContent);

module.exports = router;
