import { create } from 'zustand';
import { Exam, ExamSubmission } from '../types/exam';
import { useBatchStore } from './batchStore';

interface ExamState {
  exams: Exam[];
  submissions: ExamSubmission[];
  deployExam: (examData: Omit<Exam, 'id'> & { batches: number[] }) => void;
  getExamsForStudent: (studentId: string, class_: string, semester: string) => {
    activeExams: Exam[];
    attendedExams: Exam[];
  };
  submitExam: (submission: Omit<ExamSubmission, 'id'>) => void;
  hasStudentSubmittedExam: (examId: string, studentId: string) => boolean;
  getExamResults: (examId: string) => ExamSubmission[];
  getStudentResults: (studentId: string) => ExamSubmission[];
  isDuplicateExam: (title: string, class_: string, semester: number) => boolean;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: [],
  submissions: [],

  deployExam: (examData) => {
    const isDuplicate = get().isDuplicateExam(examData.title, examData.class, examData.semester);
    if (isDuplicate) {
      throw new Error('An exam with the same title already exists for this class and semester');
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      ...examData,
      teacher_id: examData.teacher_id,
      class: examData.class,
      semester: examData.semester,
      questions: examData.questions || [],
      is_active: true,
      start_time: new Date(examData.start_time).toISOString(),
      end_time: new Date(examData.end_time).toISOString(),
      batches: examData.batches,
    };

    set((state) => ({
      exams: [...state.exams, newExam],
    }));

    return newExam;
  },

  getExamsForStudent: (studentId, class_, semester) => {
    const now = new Date();
    const { exams, submissions } = get();
    const { getStudentBatch } = useBatchStore.getState();
    
    const studentExams = exams.filter((exam) => {
      // Get the student's batch for this exam's subject
      const studentBatch = getStudentBatch(studentId, exam.subject_id);
      
      // Check if the exam matches the student's class, semester, and batch
      return exam.class === class_ && 
             exam.semester.toString() === semester &&
             exam.is_active === true &&
             studentBatch !== null &&
             exam.batches.includes(studentBatch);
    });

    const hasSubmitted = (examId: string) => 
      submissions.some(s => s.examId === examId && s.studentId === studentId);

    return {
      activeExams: studentExams.filter(exam => {
        const startTime = new Date(exam.start_time);
        const endTime = new Date(exam.end_time);
        return startTime <= now && 
               endTime >= now && 
               !hasSubmitted(exam.id);
      }),
      attendedExams: studentExams.filter(exam => 
        hasSubmitted(exam.id) || new Date(exam.end_time) < now
      )
    };
  },

  submitExam: (submissionData) => {
    const submission: ExamSubmission = {
      id: Date.now().toString(),
      ...submissionData,
      submittedAt: new Date().toISOString()
    };

    set((state) => ({
      submissions: [...state.submissions, submission],
    }));
  },

  hasStudentSubmittedExam: (examId, studentId) => {
    return get().submissions.some(
      (s) => s.examId === examId && s.studentId === studentId
    );
  },

  getExamResults: (examId) => {
    const now = new Date();
    const exam = get().exams.find((e) => e.id === examId);
    
    if (!exam || new Date(exam.end_time) > now) {
      return [];
    }

    return get().submissions.filter((s) => s.examId === examId);
  },

  getStudentResults: (studentId) => {
    const now = new Date();
    return get().submissions.filter(
      (s) => {
        const exam = get().exams.find(e => e.id === s.examId);
        return s.studentId === studentId && 
               exam && 
               new Date(exam.end_time) <= now;
      }
    );
  },

  isDuplicateExam: (title, class_, semester) => {
    return get().exams.some(
      exam => 
        exam.title.toLowerCase() === title.toLowerCase() &&
        exam.class === class_ &&
        exam.semester === semester
    );
  },
}));