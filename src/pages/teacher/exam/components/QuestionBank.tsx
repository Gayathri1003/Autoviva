import React, { useState, useEffect } from 'react';
import { Question } from '../../../../types/exam';
import { getQuestions } from '../../../../lib/api/exams';
import { Icons } from '../../../../components/icons';

interface QuestionBankProps {
  subjectId: string;
  onSelectQuestion: (question: Question) => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ subjectId, onSelectQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [subjectId]);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions(subjectId);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            onClick={() => onSelectQuestion(question)}
            className="p-4 border rounded-lg hover:border-indigo-500 cursor-pointer transition-colors"
          >
            <p className="font-medium text-gray-900">{question.text}</p>
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
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span className="capitalize">Difficulty: {question.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;