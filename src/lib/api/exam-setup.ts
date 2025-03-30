import { supabase } from '../supabase';
import { Question } from '../../types/exam';

interface ExamSetupData {
  title: string;
  description: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  subject_id: string;
  teacher_id: string;
  class_id: string;
  total_marks: number;
  questions: Array<{ question: Question; marks: number }>;
}

export async function setupExam(examData: ExamSetupData) {
  // First, create the exam
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title: examData.title,
      description: examData.description,
      duration_minutes: examData.duration_minutes,
      start_time: examData.start_time,
      end_time: examData.end_time,
      subject_id: examData.subject_id,
      teacher_id: examData.teacher_id,
      class_id: examData.class_id,
      total_marks: examData.total_marks,
      is_active: true
    })
    .select()
    .single();

  if (examError) throw new Error('Failed to create exam');

  // Then, add the questions
  const examQuestions = examData.questions.map(({ question, marks }) => ({
    exam_id: exam.id,
    question_id: question.id,
    marks
  }));

  const { error: questionsError } = await supabase
    .from('exam_questions')
    .insert(examQuestions);

  if (questionsError) {
    // If adding questions fails, delete the exam
    await supabase.from('exams').delete().eq('id', exam.id);
    throw new Error('Failed to add exam questions');
  }

  return exam;
}

export async function getTeacherClasses(teacherId: string) {
  const { data, error } = await supabase
    .from('subject_assignments')
    .select(`
      id,
      class,
      subjects!inner(
        id,
        name,
        department,
        semester
      )
    `)
    .eq('teacher_id', teacherId);

  if (error) throw new Error('Failed to fetch teacher classes');
  return data;
}

export async function getExamQuestions(examId: string) {
  const { data, error } = await supabase
    .from('exam_questions')
    .select(`
      question_id,
      marks,
      questions:question_bank!inner(
        id,
        question_text,
        options,
        correct_answer,
        difficulty_level
      )
    `)
    .eq('exam_id', examId);

  if (error) throw new Error('Failed to fetch exam questions');

  return data.map(eq => ({
    id: eq.questions.id,
    text: eq.questions.question_text,
    options: JSON.parse(eq.questions.options),
    correct_answer: eq.questions.correct_answer,
    difficulty: eq.questions.difficulty_level,
    marks: eq.marks
  }));
}