import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useExamStore } from '../../store/examStore';
import ExamCard from './components/ExamCard';
import ExamSession from './components/ExamSession';
import { useStudentStore } from '../../store/studentStore';

const ExamPortal = () => {
  const { user } = useAuthStore();
  const { getExamsForStudent } = useExamStore();
  const { students } = useStudentStore();
  const [currentExam, setCurrentExam] = useState<any>(null);

  // Get student details from the store
  const currentStudent = students.find(s => s.id === user?.id);
  
  if (!currentStudent) {
    return (
      <div className="text-center py-8 text-gray-500">
        Student information not found
      </div>
    );
  }

  const { activeExams, attendedExams } = getExamsForStudent(
    user!.id, 
    currentStudent.class,
    currentStudent.semester
  );

  const handleStartExam = (exam: any) => {
    setCurrentExam(exam);
  };

  if (currentExam) {
    return (
      <ExamSession
        exam={currentExam}
        onClose={() => setCurrentExam(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Exams Section */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Exams</h1>
        {activeExams.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-500">
            No active exams available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStart={() => handleStartExam(exam)}
                status="active"
              />
            ))}
          </div>
        )}
      </section>

      {/* Attended Exams Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attended Exams</h2>
        {attendedExams.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-500">
            No attended exams yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attendedExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                status="attended"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ExamPortal;