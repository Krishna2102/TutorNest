const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String } // e.g. "10:45"
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    category: { type: String, required: true, enum: ['mathematics', 'science', 'programming', 'languages', 'arts'] },
    level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    duration: { type: String, required: true }, // e.g. "8 weeks"
    price: { type: Number, default: 0 },
    image: { type: String, default: '📚' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    videos: [videoSchema],
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    syllabus: [{ type: String }],
    requirements: [{ type: String }],
    outcomes: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
