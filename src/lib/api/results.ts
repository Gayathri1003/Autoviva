import { supabase } from '../supabase';

export async function submitExam(examId: string, studentId: string, responses: Array<{
  questionId: string;
  selectedOption: number;
}>) {
  // Start a transaction
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*, question_bank(*)')
    .eq('id', examId)
    .single();

  if (examError) throw new Error('Failed to fetch exam details');

  // Calculate results
  let obtainedMarks = 0;
  const questionResponses = responses.map(response => {
    const question = exam.question_bank.find(q => q.id === response.questionId);
    const isCorrect = question.correct_answer === response.selectedOption;
    const marksObtained = isCorrect ? question.marks : 0;
    obtainedMarks += marksObtained;

    return {
      question_id: response.questionId,
      selected_option: response.selectedOption,
      is_correct: isCorrect,
      marks_obtained: marksObtained
    };
  });

  const percentage = (obtainedMarks / exam.total_marks) * 100;
  const status = percentage >= 40 ? 'pass' : 'fail';

  // Insert exam result
  const { data: result, error: resultError } = await supabase
    .from('exam_results')
    .insert({
      exam_id: examId,
      student_id: studentId,
      total_marks: exam.total_marks,
      obtained_marks: obtainedMarks,
      percentage,
      status
    })
    .select()
    .single();

  if (resultError) throw new Error('Failed to save exam result');

  // Insert question responses
  const { error: responsesError } = await supabase
    .from('question_responses')
    .insert(
      questionResponses.map(response => ({
        result_id: result.id,
        ...response
      }))
    );

  if (responsesError) throw new Error('Failed to save question responses');

  // Update analytics
  await updateExamAnalytics(examId);

  return result;
}

export async function getStudentResults(studentId: string) {
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      exams (
        title,
        subject_id,
        total_marks
      )
    `)
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (error) throw new Error('Failed to fetch results');
  return data;
}

export async function getExamResults(examId: string) {
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      auth_users (
        username,
        email
      )
    `)
    .eq('exam_id', examId)
    .order('percentage', { ascending: false });

  if (error) throw new Error('Failed to fetch exam results');
  return data;
}

async function updateExamAnalytics(examId: string) {
  const { data: results, error: resultsError } = await supabase
    .from('exam_results')
    .select('obtained_marks, status')
    .eq('exam_id', examId);

  if (resultsError) throw new Error('Failed to fetch results for analytics');

  const analytics = {
    exam_id: examId,
    total_students: results.length,
    passed_students: results.filter(r => r.status === 'pass').length,
    highest_marks: Math.max(...results.map(r => r.obtained_marks)),
    lowest_marks: Math.min(...results.map(r => r.obtained_marks)),
    average_marks: results.reduce((sum, r) => sum + r.obtained_marks, 0) / results.length
  };

  const { error: analyticsError } = await supabase
    .from('result_analytics')
    .upsert({
      ...analytics,
      updated_at: new Date()
    });

  if (analyticsError) throw new Error('Failed to update analytics');
}