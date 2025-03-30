// src/lib/api/questions.ts
import { Question } from '../../types/exam';

// Mock implementation for fetching questions
export const fetchQuestions = async (subjectId: string): Promise<Question[]> => {
  // Mock data
  return [
    {
      id: '1',
      text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
      options: ['Queue', 'Linked List', 'Stack', 'Tree'],
      correct_answer: 'C',
      difficulty: 'easy',
      subject_id: subjectId,
    },
    {
      id: '2',
      text: 'What is the main advantage of using a hash table compared to a binary search tree for searching?',
      options: [
        'Guaranteed sorted order of elements',
        'Lower space complexity',
        'Average time complexity of O(1) for search, insertion, and deletion',
        'Ability to handle collisions perfectly',
      ],
      correct_answer: 'C',
      difficulty: 'medium',
      subject_id: subjectId,
    },
  ];
};

// Mock implementation for creating a question
export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const newQuestion: Question = {
    id: Date.now().toString(),
    ...question,
  };
  return newQuestion;
};