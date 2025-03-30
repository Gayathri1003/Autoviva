import React from 'react';
import { Plus } from 'lucide-react';
import { Subject, Teacher } from '../../../types';

interface TeacherCardProps {
  teacher: Teacher;
  isSelected: boolean;
  availableSubjects: Subject[];
  onSelect: (teacherId: string) => void;
  onAssignSubject: (teacherId: string, subjectId: string) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  isSelected,
  availableSubjects,
  onSelect,
  onAssignSubject,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-colors ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => onSelect(teacher.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
          <p className="text-sm text-gray-500">{teacher.department}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {teacher.subjects.length} subjects
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Current Subjects:</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {teacher.subjects.map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Available Subjects:</h4>
          <div className="mt-2 space-y-2">
            {availableSubjects
              .filter(
                (subject) =>
                  subject.department === teacher.department &&
                  !teacher.subjects.includes(subject.name)
              )
              .map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {subject.name} ({subject.code})
                    </p>
                    <p className="text-xs text-gray-500">Semester {subject.semester}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignSubject(teacher.id, subject.id);
                    }}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Assign
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCard;