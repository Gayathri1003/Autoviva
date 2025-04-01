import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useExamStore } from '../../../store/examStore';
import { Clock, Calendar } from 'lucide-react';
import ExamDetailsView from './ExamDetailsView';

const DeployedExams = () => {
  const { user } = useAuthStore();
  const { exams } = useExamStore();
  const [selectedExam, setSelectedExam] = useState(null);

  // Filter exams for the current teacher
  const teacherExams = exams.filter(exam => exam.teacher_id === user?.id);

  // Sort exams by start time
  const sortedExams = [...teacherExams].sort((a, b) => 
    new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  );

  const getExamStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { label: 'Upcoming', className: 'bg-yellow-100 text-yellow-800' };
    if (now > end) return { label: 'Completed', className: 'bg-gray-100 text-gray-800' };
    return { label: 'Active', className: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Deployed Exams</h2>
      
      {sortedExams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No exams deployed yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedExams.map(exam => {
            const status = getExamStatus(exam.start_time, exam.end_time);
            
            return (
              <div 
                key={exam.id} 
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedExam(exam)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Class:</span> {exam.class}
                  </div>
                  <div>
                    <span className="font-medium">Semester:</span> {exam.semester}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-medium mr-1">Start:</span>
                    {new Date(exam.start_time).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-medium mr-1">End:</span>
                    {new Date(exam.end_time).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium mr-1">Duration:</span>
                    {exam.duration_minutes} minutes
                  </div>
                  <div>
                    <span className="font-medium">Total Marks:</span> {exam.total_marks}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedExam && (
        <ExamDetailsView
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default DeployedExams;