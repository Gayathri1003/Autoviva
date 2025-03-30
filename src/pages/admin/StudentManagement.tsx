import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import StudentFilters from './components/StudentFilters';
import { useStudentStore } from '../../store/studentStore';

const StudentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    class: '',
  });

  const { students } = useStudentStore();

  const filteredStudents = students.filter((student) => {
    if (filters.department && student.department !== filters.department) return false;
    if (filters.semester && student.semester !== filters.semester) return false;
    if (filters.class && student.class !== filters.class) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      <StudentFilters
        filters={filters}
        onChange={setFilters}
      />

      <StudentTable
        students={filteredStudents}
        onEdit={setEditingStudent}
      />

      {(showAddModal || editingStudent) && (
        <StudentForm
          student={editingStudent}
          onClose={() => {
            setShowAddModal(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentManagement