import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExamPortal from './ExamPortal';
import ResultsView from './ResultsView';

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/exams" replace />} />
      <Route path="/exams" element={<ExamPortal />} />
      <Route path="/results" element={<ResultsView />} />
    </Routes>
  );
};

export default StudentDashboard;