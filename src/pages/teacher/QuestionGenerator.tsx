// src/pages/teacher/QuestionGenerator.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MethodSelector from './components/MethodSelector';
import DocumentUploader from './components/DocumentUploader';
import TopicGenerator from './components/TopicGenerator';
import ManualQuestionEntry from './components/ManualQuestionEntry';
import { useQuestionStore } from '../../store/questionStore';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject_id: string;
}

const QuestionGenerator = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [method, setMethod] = useState<'topic' | 'document' | 'manual'>('topic');
  const navigate = useNavigate();
  const { getQuestionsBySubject, setQuestionsToDeploy } = useQuestionStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  // Load questions for the subject when the component mounts or subjectId changes
  useEffect(() => {
    if (subjectId) {
      const subjectQuestions = getQuestionsBySubject(subjectId);
      setQuestions(subjectQuestions);
    }
  }, [subjectId, getQuestionsBySubject]);

  // If subjectId is missing, redirect to the subject selection page
  if (!subjectId) {
    navigate('/teacher/subjects');
    return null;
  }

  // Handle selecting/deselecting a question
  const handleSelectQuestion = (questionText: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionText)
        ? prev.filter((text) => text !== questionText)
        : [...prev, questionText]
    );
  };

  // Handle deploying selected questions
  const handleDeploy = () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to deploy');
      return;
    }

    const questionsToDeploy = questions.filter((q) => selectedQuestions.includes(q.text));
    setQuestionsToDeploy(questionsToDeploy); // Store selected questions for review
    navigate(`/teacher/subject/${subjectId}/exam-setup`); // Navigate to exam setup for review
    toast.success(`${selectedQuestions.length} question(s) selected for deployment!`);
  };

  // Refresh questions after adding a new one
  const refreshQuestions = () => {
    const updatedQuestions = getQuestionsBySubject(subjectId);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Questions</h1>
      <MethodSelector method={method} setMethod={setMethod} />
      {method === 'topic' ? (
        <TopicGenerator subjectId={subjectId} onQuestionsGenerated={refreshQuestions} />
      ) : method === 'document' ? (
        <DocumentUploader subjectId={subjectId} onQuestionsGenerated={refreshQuestions} />
      ) : (
        <ManualQuestionEntry subjectId={subjectId} onQuestionAdded={refreshQuestions} />
      )}

      {/* Display All Questions for the Subject */}
      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">All Questions for Subject</h2>
          <ul className="space-y-4 mt-4">
            {questions.map((question, index) => (
              <li key={question.id} className="p-4 bg-gray-100 rounded-lg flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{index + 1}. {question.text}</p>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.text)}
                    onChange={() => handleSelectQuestion(question.text)}
                    className="h-5 w-5 text-indigo-600 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  {question.options.map((option, idx) => (
                    <p
                      key={idx}
                      className={
                        question.correct_answer === String.fromCharCode(65 + idx)
                          ? 'text-green-600'
                          : ''
                      }
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Correct Answer: {question.correct_answer}
                </p>
                <p className="text-sm text-gray-500">Difficulty: {question.difficulty}</p>
              </li>
            ))}
          </ul>
          {/* Deploy Selected Questions Button */}
          <button
            onClick={handleDeploy}
            className="mt-4 w-full flex justify-center items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Deploy Selected Questions ({selectedQuestions.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;