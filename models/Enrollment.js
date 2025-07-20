const mongoose = require('mongoose');
const QuizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
});
const EnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
  quizAttempts: [QuizAttemptSchema],
  progress: { type: Number, default: 0 },
});
module.exports = mongoose.model('Enrollment', EnrollmentSchema);
