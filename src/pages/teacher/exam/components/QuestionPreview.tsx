import React from 'react';
import { Question } from '../../../../types/exam';

interface QuestionPreviewProps {
  question: Question;
  onClose: () => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Question Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="font-medium text-gray-900 mb-2">Question Text</div>
            <p className="text-gray-700">{question.text}</p>
          </div>

          <div>
            <div className="font-medium text-gray-900 mb-2">Options</div>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    index === question.correct_answer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {index === question.correct_answer && (
                      <span className="ml-auto text-green-600 text-sm font-medium">
                        Correct Answer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Difficulty:</span>
              <span className="ml-2 capitalize">{question.difficulty}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Marks:</span>
              <span className="ml-2">{question.marks || 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPreview;