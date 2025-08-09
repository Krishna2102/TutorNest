const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema(
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
      required: true,
    },
    profilePictureUrl: {
      type: String,
      default: '',
    },
    qualification: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
    subjectsTaught: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    verificationDocs: {
      type: [String], // URLs to uploaded documents
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      enum: ['teacher'],
      default: 'teacher',
      immutable: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isVerifiedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

teacherSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);
