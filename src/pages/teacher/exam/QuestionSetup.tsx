// src/pages/teacher/exam/QuestionSetup.tsx
import { useQuestionStore } from '../../../store/questionStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const QuestionSetup = () => {
  const { questionsToDeploy, clearQuestionsToDeploy } = useQuestionStore();
  const navigate = useNavigate();

  const handleDeployToStudents = () => {
    if (questionsToDeploy.length === 0) {
      toast.error('No questions selected for deployment');
      return;
    }

    // In a real implementation, you'd send the questions to a backend API to deploy to students
    // For now, we'll simulate deployment by clearing the questions and showing a success message
    clearQuestionsToDeploy();
    toast.success('Questions deployed to students successfully!');
    navigate('/teacher'); // Navigate back to the dashboard
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exam Setup</h1>
      {questionsToDeploy.length === 0 ? (
        <p>No questions selected for deployment. Please select questions from the Question Generator.</p>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4">Review Questions for Deployment</h2>
          <ul className="space-y-4">
            {questionsToDeploy.map((question, index) => (
              <li key={question.id} className="p-4 bg-gray-100 rounded-lg flex flex-col space-y-2">
                <p className="font-bold">{index + 1}. {question.text}</p>
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
          <button
            onClick={handleDeployToStudents}
            className="mt-4 w-full flex justify-center items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Deploy to Students
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionSetup;