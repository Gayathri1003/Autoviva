export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  subject_id: string;
  teacher_id: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  duration_minutes: number;
  total_marks: number;
  pass_percentage: number;
  start_time: string;
  end_time: string;
  class: string;
  semester: number;
  questions: Question[];
  batches: number[];
  is_active: boolean;
  teacher_id: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }>;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
  status: 'pass' | 'fail';
  submittedAt: string;
}

export interface QuestionStatus {
  [key: string]: 'answered' | 'flagged' | 'unanswered';
}