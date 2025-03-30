// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SubjectList from './pages/teacher/components/SubjectList';
import QuestionGenerator from './pages/teacher/QuestionGenerator';
import QuestionSetup from './pages/teacher/exam/QuestionSetup'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute role="teacher">
              <Layout>
                <Routes>
                  {/* Default teacher dashboard */}
                  <Route index element={<TeacherDashboard />} />
                  {/* Subject list page */}
                  <Route path="subjects" element={<SubjectList />} />
                  {/* Question generation page with subjectId */}
                  <Route path="subject/:subjectId/questions" element={<QuestionGenerator />} />
                  {/* Exam setup page */}
                  <Route path="subject/:subjectId/exam-setup" element={<QuestionSetup />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;