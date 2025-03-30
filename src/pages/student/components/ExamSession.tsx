import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useExamStore } from '../../../store/examStore';
import ExamTimer from './ExamTimer';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Exam, Question, QuestionStatus } from '../../../types/exam';

interface ExamSessionProps {
  exam: Exam;
  onClose: () => void;
}

const ExamSession: React.FC<ExamSessionProps> = ({ exam, onClose }) => {
  const { user } = useAuthStore();
  const { submitExam } = useExamStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>(
    Object.fromEntries(exam.questions.map((q) => [q.id, 'unanswered']))
  );

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleAnswer = (answer: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setQuestionStatus(prev => ({ ...prev, [currentQuestion.id]: 'answered' }));
  };

  const handleFlagQuestion = () => {
    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion.id]: prev[currentQuestion.id] === 'flagged' ? 'unanswered' : 'flagged'
    }));
  };

  const handleSubmit = async () => {
    const unansweredCount = Object.values(questionStatus).filter(s => s === 'unanswered').length;
    
    if (unansweredCount > 0) {
      const confirm = window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
      if (!confirm) return;
    }

    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
        isCorrect: exam.questions.find((q) => q.id === questionId)?.correct_answer === selectedOption
      }));

      const correctAnswers = answersArray.filter(a => a.isCorrect).length;
      const percentage = (correctAnswers / exam.questions.length) * 100;

      await submitExam({
        examId: exam.id,
        studentId: user!.id,
        studentName: user!.name,
        answers: answersArray,
        totalQuestions: exam.questions.length,
        correctAnswers,
        wrongAnswers: exam.questions.length - correctAnswers,
        score: correctAnswers,
        percentage,
        status: percentage >= exam.pass_percentage ? 'pass' : 'fail',
        submittedAt: new Date().toISOString(),
      });

      toast.success('Exam submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit exam');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
            </div>
            <ExamTimer endTime={exam.end_time} onTimeUp={handleSubmit} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Question Panel */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="prose max-w-none">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {currentQuestion.text}
                </h2>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === index
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswer(index)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-3">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Question Navigator</h3>
              <div className="grid grid-cols-4 gap-2">
                {exam.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`p-2 text-sm font-medium rounded ${
                      currentQuestionIndex === index
                        ? 'bg-indigo-600 text-white'
                        : questionStatus[q.id] === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : questionStatus[q.id] === 'flagged'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleFlagQuestion}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {questionStatus[currentQuestion.id] === 'flagged' ? 'Unflag Question' : 'Flag for Review'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Submit Exam
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 rounded mr-2"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-100 rounded mr-2"></span>
                    <span>Flagged for Review</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-gray-100 rounded mr-2"></span>
                    <span>Not Answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;