const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      questions,
      duration,
      startTime,
      endTime,
      batch,
    } = req.body;

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    const exam = await Exam.create({
      title,
      description,
      subject: subjectId,
      teacher: req.user._id,
      questions: questions.map(q => ({
        question: q.id,
        marks: q.marks,
      })),
      totalMarks,
      duration,
      startTime,
      endTime,
      batch,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exam' });
  }
};

exports.getTeacherExams = async (req, res) => {
  try {
    const exams = await Exam.find({ teacher: req.user._id })
      .populate('subject', 'name code')
      .sort('-createdAt');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

exports.getStudentExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      batch: req.user.batch,
      isActive: true,
      endTime: { $gte: new Date() },
    })
      .populate('subject', 'name code')
      .sort('startTime');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId)
      .populate('questions.question');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let marksObtained = 0;
    const questionResponses = answers.map(answer => {
      const questionData = exam.questions.find(q => 
        q.question._id.toString() === answer.questionId
      );
      
      const isCorrect = questionData.question.correctAnswer === answer.selectedOption;
      const marks = isCorrect ? questionData.marks : 0;
      marksObtained += marks;

      return {
        question: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        marksObtained: marks,
      };
    });

    const percentage = (marksObtained / exam.totalMarks) * 100;
    const status = percentage >= 40 ? 'pass' : 'fail';

    const result = await Result.create({
      exam: examId,
      student: req.user._id,
      answers: questionResponses,
      totalMarks: exam.totalMarks,
      marksObtained,
      percentage,
      status,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit exam' });
  }
};