import { create } from 'zustand';
import { User } from '../types';
import bcrypt from 'bcryptjs';
import { useTeacherStore } from './teacherStore';
import { useStudentStore } from './studentStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (username: string, password: string, role: 'admin' | 'teacher' | 'student') => Promise<User>;
  setPassword: (username: string, newPassword: string, role: 'teacher' | 'student') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  login: async (username: string, password: string, role: 'admin' | 'teacher' | 'student') => {
    if (role === 'admin') {
      if (username !== 'admin' || password !== 'admin123') {
        throw new Error('Invalid admin credentials');
      }
      return {
        id: '1',
        username: 'admin',
        role: 'admin' as const,
        name: 'Administrator',
      };
    }

    if (role === 'teacher') {
      const teachers = useTeacherStore.getState().teachers;
      const teacher = teachers.find(t => t.username === username);
      
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      // First time login
      if (!teacher.hasSetPassword) {
        return {
          id: teacher.id,
          username: teacher.username,
          role: 'teacher' as const,
          name: teacher.name,
          requiresPasswordSetup: true,
        };
      }

      // Check password
      if (!teacher.password || !bcrypt.compareSync(password, teacher.password)) {
        throw new Error('Invalid credentials');
      }

      return {
        id: teacher.id,
        username: teacher.username,
        role: 'teacher' as const,
        name: teacher.name,
      };
    }
    
    if (role === 'student') {
      const students = useStudentStore.getState().students;
      const student = students.find(s => s.username === username);

      if (!student) {
        throw new Error('Student not found');
      }

      // First time login
      if (!student.hasSetPassword) {
        return {
          id: student.id,
          username: student.username,
          role: 'student' as const,
          name: student.name,
          requiresPasswordSetup: true,
        };
      }

      // Check password
      if (!student.password || !bcrypt.compareSync(password, student.password)) {
        throw new Error('Invalid credentials');
      }

      return {
        id: student.id,
        username: student.username,
        role: 'student' as const,
        name: student.name,
      };
    }


    throw new Error('Invalid role');
  },

  setPassword: async (username: string, newPassword: string, role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      const teacherStore = useTeacherStore.getState();
      const teacher = teacherStore.teachers.find(t => t.username === username);
      
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      
      await teacherStore.updateTeacher(teacher.id, {
        password: hashedPassword,
        hasSetPassword: true,
      });
    }
    if (role === 'student') {
      const studentStore = useStudentStore.getState();
      const student = studentStore.students.find(s => s.username === username);

      if (!student) {
        throw new Error('Student not found');
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await studentStore.updateStudent(student.id, {
        password: hashedPassword,
        hasSetPassword: true,
      });
    }
  },
}));