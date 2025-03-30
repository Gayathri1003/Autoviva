import { create } from 'zustand';
import { Student } from '../types';

interface StudentState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  isUsernameUnique: (username: string) => boolean;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],

  addStudent: async (studentData) => {
    const { students, isUsernameUnique } = get();
    if (!isUsernameUnique(studentData.username)) {
      throw new Error('Username already exists');
    }

    try {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...studentData,
      };

      set({ students: [...students, newStudent] });
    } catch (error) {
      throw new Error('Failed to add student');
    }
  },

  updateStudent: async (id, studentData) => {
    const { students, isUsernameUnique } = get();
    const studentToUpdate = students.find((student) => student.id === id);

    if (
      studentData.username &&
      studentToUpdate?.username !== studentData.username &&
      !isUsernameUnique(studentData.username)
    ) {
      throw new Error('Username already exists');
    }

    try {
      set({
        students: students.map((student) =>
          student.id === id ? { ...student, ...studentData } : student
        ),
      });
    } catch (error) {
      throw new Error('Failed to update student');
    }
  },

  deleteStudent: async (id) => {
    try {
      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
      }));
    } catch (error) {
      throw new Error('Failed to delete student');
    }
  },

  isUsernameUnique: (username) => {
    const { students } = get();
    return !students.some((student) => student.username === username);
  },
}));
