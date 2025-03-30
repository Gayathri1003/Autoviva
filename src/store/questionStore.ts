// src/store/questionStore.ts
import { create } from 'zustand';
import { Question } from '../types/exam';

interface QuestionState {
  questions: Question[];
  questionsToDeploy: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  getQuestionsBySubject: (subjectId: string) => Question[];
  setQuestionsToDeploy: (questions: Question[]) => void;
  clearQuestionsToDeploy: () => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  questionsToDeploy: [],

  addQuestion: (questionData) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      ...questionData,
    };

    set((state) => ({
      questions: [...state.questions, newQuestion],
    }));
  },

  updateQuestion: (id, questionData) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === id ? { ...question, ...questionData } : question
      ),
    }));
  },

  deleteQuestion: (id) => {
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== id),
    }));
  },

  getQuestionsBySubject: (subjectId) => {
    return get().questions.filter((question) => question.subject_id === subjectId);
  },

  setQuestionsToDeploy: (questions) => {
    set({ questionsToDeploy: questions });
  },

  clearQuestionsToDeploy: () => {
    set({ questionsToDeploy: [] });
  },
}));