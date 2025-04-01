import React, { useState } from 'react';
import { Icons } from '../../../components/icons';
import { generateQuestionsFromText } from '../../../lib/api/gemini';
import { useQuestionStore } from '../../../store/questionStore';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

interface TopicGeneratorProps {
  subjectId: string;
  onQuestionsGenerated: () => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const { user } = useAuthStore();
  const { addQuestion } = useQuestionStore();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const questions = await generateQuestionsFromText(topic, count);
      setGeneratedQuestions(questions);

      // Save each generated question
      await Promise.all(
        questions.map(question =>
          addQuestion({
            text: question.text,
            options: question.options,
            correct_answer: question.correct_answer,
            difficulty: question.difficulty,
            subject_id: subjectId,
            teacher_id: user!.id,
            marks: 1
          })
        )
      );

      toast.success('Questions generated successfully!');
      onQuestionsGenerated();
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            placeholder="Enter the topic or concept for which you want to generate questions..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Icons.Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Generating Questions...
            </>
          ) : (
            'Generate Questions'
          )}
        </button>
      </div>

      {/* Display Generated Questions */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Generated Questions</h2>
          <div className="space-y-6">
            {generatedQuestions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">
                    {index + 1}. {question.text}
                  </p>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {question.difficulty}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded-md ${
                        optIndex === question.correct_answer
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;