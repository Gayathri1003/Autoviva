import React, { useState } from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { useExamStore } from '../../store/examStore';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useBatchStore } from '../../store/batchStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ResultsView = () => {
  const { user } = useAuthStore();
  const { getTeacherAssignments } = useTeacherStore();
  const { exams, getExamResults } = useExamStore();
  const { students } = useStudentStore();
  const { getBatchAssignments, getStudentBatch } = useBatchStore();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [expandedBatches, setExpandedBatches] = useState<number[]>([]);

  // Get all exams for this teacher's subjects
  const teacherAssignments = getTeacherAssignments(user!.id);
  const teacherExams = exams.filter(exam => 
    teacherAssignments.some(assignment => assignment.id === exam.subject_id)
  );

  // Filter out exams that haven't ended yet
  const completedExams = teacherExams.filter(exam => new Date(exam.end_time) < new Date());

  const results = selectedExam ? getExamResults(selectedExam) : [];
  const selectedExamData = completedExams.find(exam => exam.id === selectedExam);

  const toggleBatch = (batchNumber: number) => {
    if (expandedBatches.includes(batchNumber)) {
      setExpandedBatches(expandedBatches.filter(b => b !== batchNumber));
    } else {
      setExpandedBatches([...expandedBatches, batchNumber]);
    }
  };

  // Get students who were eligible to take the exam in a specific batch
  const getEligibleStudents = (batchNumber: number) => {
    if (!selectedExamData || !selectedExamData.batches) return [];
    
    // Only include students if this batch was included in the exam
    if (!selectedExamData.batches.includes(batchNumber)) return [];
    
    return students.filter(student => {
      const studentBatch = getStudentBatch(student.id, selectedExamData.subject_id);
      return studentBatch === batchNumber;
    });
  };

  // Get results for eligible students in a specific batch
  const getBatchResults = (batchNumber: number) => {
    const eligibleStudents = getEligibleStudents(batchNumber);
    
    // If this batch wasn't included in the exam, return empty array
    if (eligibleStudents.length === 0) return [];
    
    return eligibleStudents.map(student => {
      const result = results.find(r => r.studentId === student.id);
      
      if (result) {
        return {
          ...result,
          studentName: student.name,
          status: result.status
        };
      } else {
        return {
          id: `absent-${student.id}`,
          studentId: student.id,
          studentName: student.name,
          examId: selectedExam,
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          score: 0,
          percentage: 0,
          status: 'absent' as 'pass' | 'fail',
          submittedAt: '',
          answers: []
        };
      }
    });
  };

  // Calculate statistics for eligible students in a batch
  const getBatchStatistics = (batchNumber: number) => {
    const batchResults = getBatchResults(batchNumber);
    return {
      total: batchResults.length,
      passed: batchResults.filter(r => r.status === 'pass').length,
      failed: batchResults.filter(r => r.status === 'fail').length,
      absent: batchResults.filter(r => r.status === 'absent').length
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">View Results</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an exam</option>
          {completedExams.map((exam) => {
            const subject = teacherAssignments.find(a => a.id === exam.subject_id);
            return (
              <option key={exam.id} value={exam.id}>
                {exam.title} - {subject?.subjectName} - Class {exam.class} - Semester {exam.semester}
              </option>
            );
          })}
        </select>
      </div>

      {selectedExam && selectedExamData && (
        <div className="space-y-6">
          {/* Only show batches that were included in the exam */}
          {selectedExamData.batches.map((batchNumber) => {
            const batchResults = getBatchResults(batchNumber);
            const isBatchExpanded = expandedBatches.includes(batchNumber);
            const stats = getBatchStatistics(batchNumber);
            
            // Only show batches that have eligible students
            if (batchResults.length === 0) return null;
            
            return (
              <div key={batchNumber} className="bg-white shadow rounded-lg overflow-hidden">
                <div 
                  className="p-4 border-b flex justify-between items-center cursor-pointer"
                  onClick={() => toggleBatch(batchNumber)}
                >
                  <h2 className="text-lg font-medium text-gray-900">Batch {batchNumber}</h2>
                  <div className="flex items-center">
                    <div className="mr-6 text-sm">
                      <span className="text-green-600">{stats.passed} Passed</span>
                      <span className="mx-2">|</span>
                      <span className="text-red-600">{stats.failed} Failed</span>
                      <span className="mx-2">|</span>
                      <span className="text-yellow-600">{stats.absent} Absent</span>
                    </div>
                    {isBatchExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {isBatchExpanded && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchResults.map((result) => (
                        <tr key={result.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.studentName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.status === 'absent' ? (
                              <div className="text-sm text-gray-500">-</div>
                            ) : (
                              <div className="text-sm text-gray-900">
                                {result.correctAnswers}/{result.totalQuestions}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.status === 'absent' ? (
                              <div className="text-sm text-gray-500">-</div>
                            ) : (
                              <div className="text-sm font-medium">
                                {result.percentage}%
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              result.status === 'pass'
                                ? 'bg-green-100 text-green-800'
                                : result.status === 'fail'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.status === 'pass' ? 'Passed' : 
                               result.status === 'fail' ? 'Failed' : 'Absent'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.status === 'absent' ? 
                              '-' : 
                              new Date(result.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}

          {/* Summary Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {selectedExamData.batches.map((batchNumber) => {
                const stats = getBatchStatistics(batchNumber);
                if (stats.total === 0) return null;

                return (
                  <div key={batchNumber} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Batch {batchNumber}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-600">Passed: {stats.passed}</p>
                      <p className="text-red-600">Failed: {stats.failed}</p>
                      <p className="text-yellow-600">Absent: {stats.absent}</p>
                      <p className="text-gray-600">Total: {stats.total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;