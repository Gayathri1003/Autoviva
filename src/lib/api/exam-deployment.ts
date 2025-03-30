import { supabase } from '../supabase';
import { Question, Exam } from '../../types/exam';

interface ExamDeploymentData {
  title: string;
  description: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  class: string;
  semester: string;
  subject_id: string;
  total_marks: number;
  questions: (Question & { marks: number })[];
}

export async function deployExam(examData: ExamDeploymentData) {
  // Start a transaction
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title: examData.title,
      description: examData.description,
      duration_minutes: examData.duration_minutes,
      start_time: examData.start_time,
      end_time: examData.end_time,
      subject_id: examData.subject_id,
      total_marks: examData.total_marks,
      class: examData.class,
      semester: parseInt(examData.semester),
      is_active: true,
    })
    .select()
    .single();

  if (examError) throw new Error('Failed to create exam');

  // Insert exam questions with their marks
  const examQuestions = examData.questions.map(question => ({
    exam_id: exam.id,
    question_id: question.id,
    marks: question.marks,
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