const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const questionController = require('../controllers/questionController');

router.post('/generate', auth, questionController.generateQuestions);
router.get('/subject/:subjectId', auth, questionController.getQuestionsBySubject);
router.post('/', auth, questionController.createQuestion);

module.exports = router;