import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useQuestionStore } from '../../../store/questionStore';
import QuestionSelection from './components/QuestionSelection';
import ExamDeployment from './components/ExamDeployment';
import toast from 'react-hot-toast';
import { Question } from '../../../types/exam';

const QuestionSetup = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getQuestionsBySubject } = useQuestionStore();
  
  const availableQuestions = getQuestionsBySubject(subjectId!);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleDeploy = async (examData: any) => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question');
      return;
    }

    try {
      // For now, just show success message
      toast.success('Exam deployed successfully');
      navigate('/teacher');
    } catch (error) {
      toast.error('Failed to deploy exam');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Setup Exam Questions</h1>
        <button
          onClick={() => navigate('/teacher')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionSelection
          questions={availableQuestions}
          selectedQuestions={selectedQuestions}
          onSelectQuestion={(q) => setSelectedQuestions([...selectedQuestions, q])}
          onRemoveQuestion={(id) => setSelectedQuestions(selectedQuestions.filter(q => q.id !== id))}
          onUpdateMarks={(id, marks) => {
            setSelectedQuestions(selectedQuestions.map(q => 
              q.id === id ? { ...q, marks } : q
            ));
          }}
        />
        
        <ExamDeployment
          selectedQuestions={selectedQuestions}
          subjectId={subjectId!}
          onDeploy={handleDeploy}
        />
      </div>
    </div>
  );
};

export default QuestionSetup;