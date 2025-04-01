import { create } from 'zustand';
import { Question } from '../types/exam';

interface QuestionState {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  getQuestionsBySubject: (subjectId: string) => Question[];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],

  addQuestion: (questionData) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,  // Generate unique ID
      ...questionData,
    };

    set((state) => ({
      questions: [...state.questions, newQuestion],
    }));

    return newQuestion;  // Return the created question with its ID
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
}));