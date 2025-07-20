const express = require('express');
const { markLessonCompleted, attemptQuiz, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.post('/lessons/complete', markLessonCompleted);
router.post('/quizzes/attempt', attemptQuiz);
router.get('/:courseId', getProgress);
module.exports = router;
