import axios from 'axios';
import { Question } from '../../types/exam';
import { supabase } from '../supabase';

export async function generateQuestionsFromTopic(
  topic: string,
  subjectId: string,
  count: number = 5
): Promise<Question[]> {
  const { data } = await axios.post(`${API_URL}/questions/generate`, {
    topic,
    subjectId,
    count,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
}

export async function getQuestionsBySubject(subjectId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('question_bank')
    .select('*')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch questions');
  }

  return data.map(q => ({
    id: q.id,
    text: q.question_text,
    options: q.options,
    correct_answer: q.correct_answer,
    difficulty: q.difficulty_level,
    marks: q.marks
  }));
}

export async function createQuestion(question: {
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  subject_id: string;
  teacher_id: string;
}) {
  const { data, error } = await supabase
    .from('question_bank')
    .insert({
      question_text: question.text,
      options: question.options,
      correct_answer: question.correct_answer,
      difficulty_level: question.difficulty,
      subject_id: question.subject_id,
      teacher_id: question.teacher_id,
      marks: 1 // Default marks
    })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create question');
  }

  return data;
}