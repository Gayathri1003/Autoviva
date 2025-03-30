import React, { useState } from 'react';
import { useTeacherStore } from '../../../store/teacherStore';
import toast from 'react-hot-toast';

interface SubjectAssignmentFormProps {
  onClose: () => void;
}

const SubjectAssignmentForm: React.FC<SubjectAssignmentFormProps> = ({ onClose }) => {
  const { teachers, assignSubject, isSubjectAssigned } = useTeacherStore();
  const [formData, setFormData] = useState({
    teacherId: '',
    subjectCode: '',
    subjectName: '',
    department: '',
    semester: '1',
    class: '',
    isLab: false,
  });

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if the subject is already assigned to this teacher
      const isAssignedToTeacher = teachers.find(t => t.id === formData.teacherId)?.subjects
        .includes(formData.subjectName);
      
      if (isAssignedToTeacher) {
        toast.error('This subject is already assigned to this teacher');
        return;
      }

      // Check if the subject is already assigned to another teacher for this class
      const isAssignedToClass = isSubjectAssigned(
        formData.subjectCode,
        formData.department,
        parseInt(formData.semester),
        formData.class
      );

      if (isAssignedToClass) {
        toast.error('This subject is already assigned to another teacher for this class');
        return;
      }

      await assignSubject({
        ...formData,
        semester: parseInt(formData.semester),
      });
      toast.success('Subject assigned successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to assign subject');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Assign Subject to Teacher</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Teacher</label>
            <select
              required
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Code</label>
            <input
              type="text"
              required
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., CS201"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              required
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Data Structures"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <select
              required
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Class</option>
              {['A', 'B', 'C', 'D'].map((classOption) => (
                <option key={classOption} value={classOption}>Class {classOption}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLab"
              checked={formData.isLab}
              onChange={(e) => setFormData({ ...formData, isLab: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isLab" className="ml-2 block text-sm text-gray-700">
              This is a lab subject
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Assign Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectAssignmentForm;