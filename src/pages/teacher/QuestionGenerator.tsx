import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import QuestionForm from './components/QuestionForm';
import TopicGenerator from './components/TopicGenerator';
import DocumentUploader from './components/DocumentUploader';
import MethodSelector from './components/MethodSelector';
import { useAuthStore } from '../../store/authStore';
import { Home } from 'lucide-react';

type GenerationMethod = 'upload' | 'manual' | 'topic' | null;

const QuestionGenerator = () => {
  const location = useLocation();
  const subjectId = location.state?.subjectId;
  const subjectName = location.state?.subjectName;
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!subjectId || !subjectName) {
    navigate('/teacher');
    return null;
  }

  const handleMethodSelect = (method: GenerationMethod) => {
    setGenerationMethod(method);
  };

  const handleQuestionsGenerated = () => {
    toast.success('Questions have been generated successfully!');
    setGenerationMethod(null);
  };

  const handleGoHome = () => {
    navigate('/teacher');
  };

  const renderMethodContent = () => {
    switch (generationMethod) {
      case 'upload':
        return (
          <DocumentUploader 
            subjectId={subjectId}
            onQuestionsGenerated={handleQuestionsGenerated}
          />
        );
      case 'manual':
        return (
          <QuestionForm 
            subjectId={subjectId}
            onSuccess={handleQuestionsGenerated}
            onClose={() => setGenerationMethod(null)}
          />
        );
      case 'topic':
        return (
          <TopicGenerator
            subjectId={subjectId}
            onQuestionsGenerated={handleQuestionsGenerated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Questions</h1>
          <p className="text-gray-600 mt-1">Subject: {subjectName}</p>
        </div>
        <button
          onClick={handleGoHome}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </button>
      </div>

      {!generationMethod ? (
        <MethodSelector onSelect={handleMethodSelect} />
      ) : (
        <>
          {renderMethodContent()}
          <button
            onClick={() => setGenerationMethod(null)}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            ← Back to methods
          </button>
        </>
      )}
    </div>
  );
};

export default QuestionGenerator;