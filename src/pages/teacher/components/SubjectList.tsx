import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherStore } from '../../../store/teacherStore';
import { useAuthStore } from '../../../store/authStore';
import SubjectCard from './SubjectCard';
import EmptyState from './EmptyState';

const SubjectList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getTeacherAssignments } = useTeacherStore();

  const assignments = user ? getTeacherAssignments(user.id) : [];

  const handleGenerateQuestions = (assignmentId: string) => {
    navigate(`/teacher/subject/${assignmentId}/questions`);
  };

  const handleViewResults = (assignmentId: string) => {
    navigate(`/teacher/subject/${assignmentId}/results`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <SubjectCard
              key={assignment.id}
              assignment={assignment}
              onGenerateQuestions={handleGenerateQuestions}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default SubjectList;