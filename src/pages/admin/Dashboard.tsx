import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherManagement from './TeacherManagement';
import StudentManagement from './StudentManagement';
import SubjectAssignment from './SubjectAssignment';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/teachers" element={<TeacherManagement />} />
      <Route path="/students" element={<StudentManagement />} />
      <Route path="/subjects" element={<SubjectAssignment />} />
    </Routes>
  );
};

export default AdminDashboard;