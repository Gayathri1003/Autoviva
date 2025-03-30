import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SubjectList from './components/SubjectList';
import QuestionGenerator from './QuestionGenerator';
import ResultsView from './ResultsView';
import QuestionSetup from './exam/QuestionSetup';
import DeployedExams from './components/DeployedExams';
import SubjectDashboard from './SubjectDashboard';
import BatchManagement from './BatchManagement';

const TeacherDashboard = () => {
  return (
    <Routes>
      <Route index element={
        <div className="space-y-6">
          <SubjectList />
          <DeployedExams />
        </div>
      } />
      <Route path="questions" element={<QuestionGenerator />} />
      <Route path="results" element={<ResultsView />} />
      <Route path="batches" element={<BatchManagement />} />
      <Route path="subject/:subjectId/*" element={<SubjectDashboard />} />
      <Route path="subject/:subjectId/exam-setup" element={<QuestionSetup />} />
    </Routes>
  );
};

export default TeacherDashboard;