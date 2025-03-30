const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
  }],
  totalMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Result', resultSchema);