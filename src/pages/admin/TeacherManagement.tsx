import React, { useState } from 'react';
import { UserPlus, Search, Pencil, Trash2 } from 'lucide-react';
import TeacherForm from './components/TeacherForm';
import { useTeacherStore } from '../../store/teacherStore';
import toast from 'react-hot-toast';

const TeacherManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const { teachers, deleteTeacher } = useTeacherStore();

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(teacherId);
        toast.success('Teacher deleted successfully');
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search teachers..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Teachers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTeacher(teacher)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Teacher Modal */}
      {(showAddModal || editingTeacher) && (
        <TeacherForm
          teacher={editingTeacher}
          onClose={() => {
            setShowAddModal(false);
            setEditingTeacher(null);
          }}
        />
      )}
    </div>
  );
};

export default TeacherManagement;