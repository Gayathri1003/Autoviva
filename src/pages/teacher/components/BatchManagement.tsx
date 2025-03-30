import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useStudentStore } from '../../../store/studentStore';
import { useBatchStore } from '../../../store/batchStore';
import { Student } from '../../../types';
import { Search, Users } from 'lucide-react';

interface BatchManagementProps {
  subjectId: string;
  class_: string;
  semester: string;
}

const BatchManagement: React.FC<BatchManagementProps> = ({ 
  subjectId, 
  class_,
  semester 
}) => {
  const { user } = useAuthStore();
  const { students } = useStudentStore();
  const { assignBatch, getBatchAssignments, getStudentBatch } = useBatchStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  // Filter students by class and semester
  const classStudents = students.filter(
    student => 
      student.class === class_ && 
      student.semester === semester
  );

  // Filter students by search query
  const filteredStudents = classStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBatchAssignment = (student: Student, batchNumber: number) => {
    assignBatch({
      teacherId: user!.id,
      subjectId,
      studentId: student.id,
      class: class_,
      batchNumber,
    });
  };

  const getBatchStudents = (batchNumber: number) => {
    return filteredStudents.filter(
      student => getStudentBatch(student.id, subjectId) === batchNumber
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Batch Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedBatch || ''}
            onChange={(e) => setSelectedBatch(e.target.value ? Number(e.target.value) : null)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Batches</option>
            {[1, 2, 3, 4].map((batch) => (
              <option key={batch} value={batch}>Batch {batch}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((batchNumber) => (
          <div key={batchNumber} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Batch {batchNumber}</h3>
              <span className="px-2 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                {getBatchStudents(batchNumber).length} students
              </span>
            </div>
            <div className="space-y-3">
              {getBatchStudents(batchNumber).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.username}</p>
                  </div>
                  <button
                    onClick={() => handleBatchAssignment(student, 0)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <select
                onChange={(e) => {
                  const studentId = e.target.value;
                  if (studentId) {
                    const student = filteredStudents.find(s => s.id === studentId);
                    if (student) {
                      handleBatchAssignment(student, batchNumber);
                    }
                    e.target.value = ''; // Reset select after assignment
                  }
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Add student to batch...</option>
                {filteredStudents
                  .filter(student => !getStudentBatch(student.id, subjectId))
                  .map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.username})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Students */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Unassigned Students</h3>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents
              .filter(student => !getStudentBatch(student.id, subjectId))
              .map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.username}</p>
                  </div>
                  <select
                    onChange={(e) => {
                      const batchNumber = Number(e.target.value);
                      if (batchNumber) {
                        handleBatchAssignment(student, batchNumber);
                      }
                      e.target.value = ''; // Reset select after assignment
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Assign to batch...</option>
                    {[1, 2, 3, 4].map(batch => (
                      <option key={batch} value={batch}>Batch {batch}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;