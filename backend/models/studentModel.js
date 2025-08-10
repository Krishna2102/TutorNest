const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: Date,
    },
    location: {
      type: String,
      default: '', // e.g., "Nairobi, Kenya"
    },
    educationLevel: {
      type: String,
      enum: ['school', 'university', 'other'],
      default: 'school',
    },
    class: {
      type: String,
      default: '', // e.g., "Grade 10", "Class 12", "A-Level"
    },
    degree: {
      type: String,
      default: '', // e.g., "Bachelor of Science", "Master of Arts"
    },
    schoolName: {
      type: String,
      default: '', // School name for school students
    },
    universityName: {
      type: String,
      default: '', // University name for university students
    },
    institution: {
      type: String,
      default: '', // Generic institution name for other education levels
    },
    preferredSubjects: {
      type: [String],
      default: [],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student'],
      default: 'student',
      immutable: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
