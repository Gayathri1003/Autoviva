import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacherStore } from '../../store/teacherStore';
import { useStudentStore } from '../../store/studentStore';
import SubjectHeader from './components/SubjectHeader';
import SubjectInfo from './components/SubjectInfo';
import QuickActions from './components/QuickActions';
import StudentList from './components/StudentList';
import BatchManagement from './components/BatchManagement';

const SubjectDashboard = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjectAssignments } = useTeacherStore();
  const { students } = useStudentStore();
  const [activeTab, setActiveTab] = useState('overview');

  const assignment = subjectAssignments.find(a => a.id === subjectId);

  if (!assignment) {
    return <div>Subject not found</div>;
  }

  // Filter students based on semester and class
  const subjectStudents = students.filter(student => 
    student.semester === assignment.semester.toString() &&
    student.class === assignment.class
  );

  const handleGenerateQuestions = () => {
    navigate(`/teacher/subject/${subjectId}/questions`);
  };

  const handleViewResults = () => {
    navigate(`/teacher/subject/${subjectId}/results`);
  };

  return (
    <div className="space-y-6">
      <SubjectHeader
        subjectName={assignment.subjectName}
        subjectCode={assignment.subjectCode}
        isLab={assignment.isLab}
      />

      <SubjectInfo
        department={assignment.department}
        semester={assignment.semester}
        class={assignment.class}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'batches'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Batch Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickActions
                onGenerateQuestions={handleGenerateQuestions}
                onViewResults={handleViewResults}
              />
              <StudentList students={subjectStudents} />
            </div>
          ) : (
            <BatchManagement
              subjectId={subjectId!}
              class_={assignment.class}
              semester={assignment.semester.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDashboard;