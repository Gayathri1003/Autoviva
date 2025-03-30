import axios from 'axios';
import { Subject } from '../../types';

const API_URL = 'http://localhost:5000/api';

export async function getTeacherSubjects() {
  const { data } = await axios.get(`${API_URL}/subjects/teacher`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function createSubject(subject: Omit<Subject, 'id'>) {
  const { data } = await axios.post(`${API_URL}/subjects`, subject, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function assignTeacher(subjectId: string, teacherId: string) {
  const { data } = await axios.post(`${API_URL}/subjects/assign-teacher`, {
    subjectId,
    teacherId,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}