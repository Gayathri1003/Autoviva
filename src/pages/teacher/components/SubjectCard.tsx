import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../components/icons';
import { SubjectAssignment } from '../../../types';

interface SubjectCardProps {
  assignment: SubjectAssignment;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ assignment }) => {
  const navigate = useNavigate();

  const handleGenerateQuestions = () => {
    navigate('/teacher/questions', {
      state: {
        subjectId: assignment.id,
        subjectName: assignment.subjectName
      }
    });
  };

  const handleViewSubject = () => {
    navigate(`/teacher/subject/${assignment.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleViewSubject}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {assignment.subjectName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {assignment.subjectCode}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            assignment.isLab
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {assignment.isLab ? 'Lab' : 'Theory'}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <Icons.BookOpen className="w-4 h-4 mr-2" />
            <span>{assignment.department}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Icons.GraduationCap className="w-4 h-4 mr-2" />
            <span>Semester {assignment.semester}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Icons.Users className="w-4 h-4 mr-2" />
            <span>Class {assignment.class}</span>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/teacher/subject/${assignment.id}/exam-setup`);
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
          >
            Setup Exam
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateQuestions();
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
          >
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;