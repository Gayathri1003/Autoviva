import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export async function signIn(username: string, password: string, role: 'admin' | 'teacher' | 'student') {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
    role,
  });
  return data;
}

export async function setPassword(username: string, newPassword: string, role: 'teacher' | 'student') {
  const { data } = await axios.post(`${API_URL}/auth/set-password`, {
    username,
    newPassword,
    role,
  });
  return data;
}