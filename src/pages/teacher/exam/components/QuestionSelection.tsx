import React, { useState, useEffect } from 'react';
import { Question } from '../../../../types/exam';
import { Icons } from '../../../../components/icons';

interface QuestionSelectionProps {
  questions: Question[];
  selectedQuestions: Question[];
  onSelectQuestion: (question: Question) => void;
  onRemoveQuestion: (questionId: string) => void;
  onUpdateMarks: (questionId: string, marks: number) => void;
}

const QuestionSelection: React.FC<QuestionSelectionProps> = ({
  questions,
  selectedQuestions,
  onSelectQuestion,
  onRemoveQuestion,
  onUpdateMarks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);

  // Update available questions whenever questions or selectedQuestions change
  useEffect(() => {
    // Create a map of selected question IDs for efficient lookup
    const selectedIds = new Set(selectedQuestions.map(q => q.id));
    
    // Filter out questions that are already selected
    const available = questions.filter(q => !selectedIds.has(q.id));
    
    // Update available questions
    setAvailableQuestions(available);
  }, [questions, selectedQuestions]);

  // Filter questions based on search query
  const filteredQuestions = availableQuestions.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Selected Questions</h3>
        {selectedQuestions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No questions selected yet</p>
        ) : (
          <div className="space-y-4">
            {selectedQuestions.map((question, index) => (
              <div key={question.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <span className="text-gray-500 mt-1">{index + 1}.</span>
                <div className="flex-grow">
                  <p className="font-medium">{question.text}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`text-sm p-2 rounded ${
                          optIndex === question.correct_answer
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <label className="text-sm text-gray-600 mr-2">Marks:</label>
                      <input
                        type="number"
                        min="1"
                        value={question.marks || 1}
                        onChange={(e) => onUpdateMarks(question.id, parseInt(e.target.value))}
                        className="w-20 text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      onClick={() => onRemoveQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Available Questions</h3>
        <div className="relative mb-4">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="p-4 border rounded-lg hover:border-indigo-500 transition-colors"
            >
              <p className="font-medium">{question.text}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      index === question.correct_answer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500 capitalize">
                  Difficulty: {question.difficulty}
                </span>
                <button
                  onClick={() => onSelectQuestion({ ...question })}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Select Question
                </button>
              </div>
            </div>
          ))}
          {filteredQuestions.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No available questions found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSelection;