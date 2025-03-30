const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const examController = require('../controllers/examController');

router.post('/', auth, examController.createExam);
router.get('/teacher', auth, examController.getTeacherExams);
router.get('/student', auth, examController.getStudentExams);
router.post('/submit', auth, examController.submitExam);

module.exports = router;