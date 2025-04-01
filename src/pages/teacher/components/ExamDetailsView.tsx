import React from 'react';
import { X } from 'lucide-react';
import { Exam, Question } from '../../../types/exam';

interface ExamDetailsViewProps {
  exam: Exam;
  onClose: () => void;
}

const ExamDetailsView: React.FC<ExamDetailsViewProps> = ({ exam, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
              <p className="text-gray-500 mt-1">{exam.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Exam Info */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Marks</p>
              <p className="text-lg font-semibold">{exam.total_marks}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-semibold">{exam.duration_minutes} minutes</p>
            </div>
          </div>
        </div>

        {/* Questions List - Scrollable */}
        <div className="p-6 max-h-[calc(100vh-24rem)] overflow-y-auto">
          
          <div className="space-y-6">
            {exam.questions.map((question, index) => (
              <div 
                key={question.id} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {question.marks} marks
                    </span>
                    <span className={`px-2 py-1 text-sm font-medium rounded ${
                      question.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800'
                        : question.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{question.text}</p>
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-4 rounded-lg ${
                        optIndex === question.correct_answer
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 mr-3 shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className={`flex-1 ${
                          optIndex === question.correct_answer
                            ? 'text-green-800 font-medium'
                            : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                        {optIndex === question.correct_answer && (
                          <span className="text-green-600 font-medium text-sm ml-3 shrink-0">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsView;