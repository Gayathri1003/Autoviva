import React from 'react';

interface ExamQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
    marks: number;
  };
  selectedAnswer?: number | null;
  onAnswer: (answer: number) => void;
  showFeedback?: boolean;
  correctAnswer?: number;
}

const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswer,
  showFeedback,
  correctAnswer
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <p className="text-lg text-gray-900">{question.text}</p>
        <span className="text-sm text-gray-500">Marks: {question.marks}</span>
      </div>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedAnswer === index
                ? 'border-indigo-500 bg-indigo-50'
                : showFeedback
                ? index === correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : selectedAnswer === index
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswer(index)}
              disabled={showFeedback}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-3">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ExamQuestion;