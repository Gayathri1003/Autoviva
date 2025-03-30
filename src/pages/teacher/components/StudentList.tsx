import React from 'react';
import { Student } from '../../../types';

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium mb-4">Students</h2>
      <div className="overflow-y-auto max-h-64">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div>
              <p className="font-medium text-gray-900">{student.name}</p>
              <p className="text-sm text-gray-500">{student.username}</p>
            </div>
            <span className="text-sm text-gray-500">
              Roll: {student.username}
            </span>
          </div>
        ))}

        {students.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No students found for this class
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;