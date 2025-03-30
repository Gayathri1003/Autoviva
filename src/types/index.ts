import { Exam, ExamSubmission } from './exam';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  requiresPasswordSetup?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  email: string;
  subjects: string[];
  hasSetPassword: boolean;
  password?: string;
}

export interface Student {
  id: string;
  name: string;
  username: string;
  email: string;
  department: string;
  semester: string;
  class: string;
  hasSetPassword: boolean;
  password?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  isLab: boolean;
}

export interface SubjectAssignment {
  id: string;
  teacherId: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: number;
  class: string;
  isLab: boolean;
}

export interface BatchAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  studentId: string;
  class: string;
  batchNumber: number;
  createdAt: string;
}