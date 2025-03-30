import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useTeacherStore } from '../../store/teacherStore';
import SubjectAssignmentForm from './components/SubjectAssignmentForm';
import toast from 'react-hot-toast';

const SubjectAssignment = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const { teachers, subjectAssignments, removeSubjectAssignment } = useTeacherStore();

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this subject assignment?')) {
      try {
        await removeSubjectAssignment(assignmentId);
        toast.success('Subject assignment removed successfully');
      } catch (error) {
        toast.error('Failed to remove subject assignment');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Subject Assignments</h1>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Assign Subject
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjectAssignments.map((assignment) => {
              const teacher = teachers.find(t => t.id === assignment.teacherId);
              return (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {teacher?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {teacher?.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.subjectName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {assignment.subjectCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.isLab
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {assignment.isLab ? 'Lab' : 'Theory'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingAssignment(assignment)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(showAssignModal || editingAssignment) && (
        <SubjectAssignmentForm 
          assignment={editingAssignment}
          onClose={() => {
            setShowAssignModal(false);
            setEditingAssignment(null);
          }} 
        />
      )}
    </div>
  );
};

export default SubjectAssignment;