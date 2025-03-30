import React from 'react';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useTeacherStore } from '../../../store/teacherStore';

interface SubjectSelectorProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubject,
  onSubjectChange,
}) => {
  const { user } = useAuthStore(); // Fetch the logged-in user's details
  const { getTeacherAssignments } = useTeacherStore(); // Get the store method for fetching subjects

  // Fetch the assignments for the logged-in teacher
  const assignments = user ? getTeacherAssignments(user.id) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
        <h2 className="text-lg font-medium">Select Subject</h2>
      </div>
      <select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select a subject</option>
        {assignments.map((assignment) => (
          <option key={assignment.id} value={assignment.id}>
            {assignment.subjectName} ({assignment.subjectCode})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubjectSelector;
