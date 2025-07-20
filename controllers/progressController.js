const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
exports.markLessonCompleted = async (req, res) => {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;
    try {
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }
        const course = await Course.findById(courseId);
        const totalLessons = course.lessons.length;
        enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
        await enrollment.save();
        res.status(200).json({ success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.attemptQuiz = async (req, res) => {
    const { courseId, quizId, answers } = req.body;
    const userId = req.user._id;
    try {
        const course = await Course.findById(courseId);
        const quiz = course.quizzes.id(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score++;
            }
        });
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        enrollment.quizAttempts.push({ quizId, score, totalQuestions: quiz.questions.length });
        await enrollment.save();
        res.status(200).json({ success: true, data: { score, total: quiz.questions.length } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProgress = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
        }
        res.status(200).json({ success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
