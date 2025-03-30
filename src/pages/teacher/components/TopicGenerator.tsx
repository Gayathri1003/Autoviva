// src/pages/teacher/components/TopicGenerator.tsx
import { useState } from 'react';
import { generateQuestionsFromText } from '../../../lib/api/gemini';
import { useQuestionStore } from '../../../store/questionStore';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface TopicGeneratorProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const { addQuestion } = useQuestionStore();

  // Parse the API response to extract questions
  const parseQuestions = (content: string) => {
    const lines = content.split('\n');
    const questions: any[] = [];
    let currentQuestion: any = {
      text: '',
      options: [],
      correct_answer: '',
      difficulty: 'medium',
    };

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return; // Skip empty lines

      if (line.startsWith('- Question:')) {
        if (
          currentQuestion.text &&
          currentQuestion.options.length === 4 &&
          currentQuestion.correct_answer &&
          currentQuestion.difficulty
        ) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          text: line.replace('- Question:', '').trim(),
          options: [],
          correct_answer: '',
          difficulty: 'medium',
        };
      } else if (line.startsWith('- Options:') && currentQuestion.text) {
        const optionsString = line.replace('- Options:', '').trim();
        const options = optionsString.split(',').map((opt) => {
          const optionText = opt.trim();
          return optionText.replace(/^[A-D]\)\s*/, '');
        });
        if (options.length === 4) {
          currentQuestion.options = options;
        }
      } else if (line.startsWith('- Answer:') && currentQuestion.text) {
        const answer = line.replace('- Answer:', '').trim();
        if (['A', 'B', 'C', 'D'].includes(answer)) {
          currentQuestion.correct_answer = answer;
        }
      } else if (line.startsWith('- Difficulty:') && currentQuestion.text) {
        const difficulty = line.replace('- Difficulty:', '').trim().toLowerCase();
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
          currentQuestion.difficulty = difficulty as 'easy' | 'medium' | 'hard';
        }
      }
    });

    if (
      currentQuestion.text &&
      currentQuestion.options.length === 4 &&
      currentQuestion.correct_answer &&
      currentQuestion.difficulty
    ) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  // Handle question generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a valid topic');
      return;
    }

    setLoading(true);
    try {
      const generatedResponse = await generateQuestionsFromText(topic, count);
      const content = generatedResponse.candidates[0].content.parts[0].text;
      const extractedQuestions = parseQuestions(content);

      if (extractedQuestions.length === 0) {
        throw new Error('No valid questions were extracted from the response');
      }

      // Add each question to the store
      for (const question of extractedQuestions) {
        await addQuestion({
          text: question.text,
          options: question.options,
          correct_answer: question.correct_answer,
          difficulty: question.difficulty,
          subject_id: subjectId,
        });
      }

      toast.success('Questions generated successfully!');
      setTopic('');
      if (onQuestionsGenerated) onQuestionsGenerated();
    } catch (error) {
      toast.error('Failed to generate questions');
      console.error('Topic generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Topic</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="Enter the topic for generating questions..."
          disabled={loading}
        />
      </div>

      {/* Number of Questions Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
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

      {/* Generate Questions Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : 'Generate Questions'}
      </button>
    </div>
  );
};

export default TopicGenerator;