// src/pages/teacher/components/ManualQuestionEntry.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuestionStore } from '../../../store/questionStore';

interface ManualQuestionEntryProps {
  subjectId: string;
  onQuestionAdded?: () => void;
}

const ManualQuestionEntry: React.FC<ManualQuestionEntryProps> = ({ subjectId, onQuestionAdded }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { addQuestion } = useQuestionStore();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (!text.trim()) {
      toast.error('Please enter the question text');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      toast.error('Please fill in all options');
      return;
    }

    addQuestion({
      text,
      options,
      correct_answer: correctAnswer,
      difficulty,
      subject_id: subjectId,
    });

    toast.success('Question added successfully!');
    // Reset form
    setText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('A');
    setDifficulty('medium');

    if (onQuestionAdded) onQuestionAdded();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="Enter the question..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        onClick={handleAddQuestion}
        className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        Add Question
      </button>
    </div>
  );
};

export default ManualQuestionEntry;