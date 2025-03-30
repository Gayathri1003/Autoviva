import React, { useState } from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useBatchStore } from '../../store/batchStore';
import { Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const BatchManagement = () => {
  const { user } = useAuthStore();
  const { getTeacherAssignments } = useTeacherStore();
  const { students } = useStudentStore();
  const { assignBatch, getBatchAssignments, getStudentBatch } = useBatchStore();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const teacherAssignments = getTeacherAssignments(user!.id);

  const handleBatchAssignment = (studentId: string, subjectId: string, batchNumber: number) => {
    try {
      const assignment = teacherAssignments.find(a => a.id === subjectId);
      if (!assignment) return;

      assignBatch({
        teacherId: user!.id,
        subjectId,
        studentId,
        class: assignment.class,
        batchNumber,
      });
      toast.success('Student assigned to batch successfully');
    } catch (error) {
      toast.error('Failed to assign student to batch');
    }
  };

  const currentAssignment = teacherAssignments.find(a => a.id === selectedSubject);
  const classStudents = currentAssignment ? students.filter(student => 
    student.class === currentAssignment.class &&
    student.semester.toString() === currentAssignment.semester.toString()
  ) : [];

  const filteredStudents = classStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBatchStudents = (batchNumber: number) => {
    return filteredStudents.filter(
      student => getStudentBatch(student.id, selectedSubject) === batchNumber
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Subject</option>
            {teacherAssignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.subjectName} - Class {assignment.class}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSubject ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
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
                        onClick={() => handleBatchAssignment(student.id, selectedSubject, 0)}
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
                        handleBatchAssignment(studentId, selectedSubject, batchNumber);
                        e.target.value = ''; // Reset select after assignment
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Add student to batch...</option>
                    {filteredStudents
                      .filter(student => !getStudentBatch(student.id, selectedSubject))
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

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Unassigned Students</h3>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents
                  .filter(student => !getStudentBatch(student.id, selectedSubject))
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
                            handleBatchAssignment(student.id, selectedSubject, batchNumber);
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
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Subject Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please select a subject to manage student batches
          </p>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;