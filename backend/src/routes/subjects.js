const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');

router.post('/', auth, subjectController.createSubject);
router.get('/teacher', auth, subjectController.getTeacherSubjects);
router.post('/assign-teacher', auth, subjectController.assignTeacher);

module.exports = router;