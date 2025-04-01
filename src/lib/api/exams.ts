import axios from 'axios';
import { Question, Exam } from '../../types/exam;';

const API_URL = 'http://localhost:5000/api';

export async function createExam(examData: {
  title: string;
  description: string;
  subjectId: string;
  questions: Array<{ id: string; marks: number }>;
  duration: number;
  startTime: string;
  endTime: string;
  class: string;
}) {
  const { data } = await axios.post(`${API_URL}/exams`, examData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function getTeacherExams() {
  const { data } = await axios.get(`${API_URL}/exams/teacher`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function getStudentExams() {
  const { data } = await axios.get(`${API_URL}/exams/student`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function getActiveExamsForStudent(studentId: string) {
  const { data } = await axios.get(`${API_URL}/exams/student/active`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function submitExam(examId: string, answers: Array<{
  questionId: string;
  selectedOption: number;
}>) {
  const { data } = await axios.post(`${API_URL}/exams/submit`, {
    examId,
    answers,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function getQuestions(subjectId: string) {
  const { data } = await axios.get(`${API_URL}/questions/subject/${subjectId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}