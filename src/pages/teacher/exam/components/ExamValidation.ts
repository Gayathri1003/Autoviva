import { Question } from '../../../../types/exam';

export interface ExamValidationRules {
  minQuestions: number;
  maxQuestions: number;
  minTotalMarks: number;
  maxTotalMarks: number;
  requiredDifficulties: string[];
}

export const validateExam = (
  questions: Question[],
  rules: ExamValidationRules = {
    minQuestions: 5,
    maxQuestions: 100,
    minTotalMarks: 10,
    maxTotalMarks: 100,
    requiredDifficulties: ['easy', 'medium', 'hard']
  }
) => {
  const errors: string[] = [];
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  const difficulties = new Set(questions.map(q => q.difficulty));

  if (questions.length < rules.minQuestions) {
    errors.push(`Minimum ${rules.minQuestions} questions required`);
  }

  if (questions.length > rules.maxQuestions) {
    errors.push(`Maximum ${rules.maxQuestions} questions allowed`);
  }

  if (totalMarks < rules.minTotalMarks) {
    errors.push(`Total marks must be at least ${rules.minTotalMarks}`);
  }

  if (totalMarks > rules.maxTotalMarks) {
    errors.push(`Total marks cannot exceed ${rules.maxTotalMarks}`);
  }

  const missingDifficulties = rules.requiredDifficulties.filter(
    d => !difficulties.has(d)
  );

  if (missingDifficulties.length > 0) {
    errors.push(`Missing questions of difficulty: ${missingDifficulties.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};