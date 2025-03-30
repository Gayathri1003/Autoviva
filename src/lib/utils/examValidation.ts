interface ValidationRules {
  minQuestions: number;
  maxQuestions: number;
  minMarksPerQuestion: number;
  maxMarksPerQuestion: number;
  requiredDifficulties: ('easy' | 'medium' | 'hard')[];
}

export const defaultRules: ValidationRules = {
  minQuestions: 5,
  maxQuestions: 100,
  minMarksPerQuestion: 1,
  maxMarksPerQuestion: 10,
  requiredDifficulties: ['easy', 'medium', 'hard']
};

export function validateExam(questions: any[], rules: ValidationRules = defaultRules) {
  const errors: string[] = [];
  const difficulties = new Set(questions.map(q => q.difficulty));

  if (questions.length < rules.minQuestions) {
    errors.push(`Minimum ${rules.minQuestions} questions required`);
  }

  if (questions.length > rules.maxQuestions) {
    errors.push(`Maximum ${rules.maxQuestions} questions allowed`);
  }

  const invalidMarks = questions.find(
    q => q.marks < rules.minMarksPerQuestion || q.marks > rules.maxMarksPerQuestion
  );
  if (invalidMarks) {
    errors.push(`Marks per question must be between ${rules.minMarksPerQuestion} and ${rules.maxMarksPerQuestion}`);
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
}