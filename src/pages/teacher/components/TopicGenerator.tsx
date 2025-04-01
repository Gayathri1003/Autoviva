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

interface Question {
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject_id: string;
  teacher_id: string;
  marks: number;
}

interface GeneratedQuestion {
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const { user } = useAuthStore();
  const { addQuestion } = useQuestionStore();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      // Fetch generated questions
      const rawQuestions: GeneratedQuestion[] = await generateQuestionsFromText(topic, count);

      // Transform GeneratedQuestion[] to Question[]
      const questions: Question[] = rawQuestions.map((q) => ({
        ...q,
        subject_id: subjectId,
        teacher_id: user!.id,
        marks: 1, // Default marks value
      }));

      setGeneratedQuestions(questions);
      setSelectedQuestions(new Set(questions.map((_, i) => i)));
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (index: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSaveQuestions = async () => {
    try {
      const selectedQuestionsList = Array.from(selectedQuestions).map(
        (index) => generatedQuestions[index]
      );

      await Promise.all(
        selectedQuestionsList.map((question) =>
          addQuestion({
            text: question.text,
            options: question.options,
            correct_answer: question.correct_answer,
            difficulty: question.difficulty,
            subject_id: subjectId,
            teacher_id: user!.id,
            marks: 1,
          })
        )
      );

      toast.success('Selected questions saved successfully!');
      onQuestionsGenerated();
      setGeneratedQuestions([]);
      setSelectedQuestions(new Set());
    } catch (error) {
      toast.error('Failed to save questions');
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

      {generatedQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Generated Questions</h2>
            <div className="space-x-4">
              <button
                onClick={() => setSelectedQuestions(new Set(generatedQuestions.map((_, i) => i)))}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedQuestions(new Set())}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors ${
                  selectedQuestions.has(index)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleQuestionSelection(index)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(index)}
                      onChange={() => toggleQuestionSelection(index)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="font-medium text-gray-900">
                      {index + 1}. {question.text}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {question.difficulty}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded-md ${
                        optIndex === question.correct_answer
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveQuestions}
              disabled={selectedQuestions.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Save Selected Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;