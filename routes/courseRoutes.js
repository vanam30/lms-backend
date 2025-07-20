const express = require('express');
const { createCourse, getCourses, getCourseById, enrollCourse } = require('../controllers/courseController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
router.route('/').get(getCourses).post(protect, isAdmin, createCourse);
router.route('/:id').get(getCourseById);
router.route('/:id/enroll').post(protect, enrollCourse);
module.exports = router;
