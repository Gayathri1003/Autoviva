import { create } from 'zustand';
import { BatchAssignment } from '../types';

interface BatchState {
  batchAssignments: BatchAssignment[];
  assignBatch: (assignment: Omit<BatchAssignment, 'id' | 'createdAt'>) => void;
  removeBatchAssignment: (studentId: string, subjectId: string) => void;
  getBatchAssignments: (teacherId: string, subjectId: string, class_: string) => BatchAssignment[];
  getStudentBatch: (studentId: string, subjectId: string) => number | null;
}

export const useBatchStore = create<BatchState>((set, get) => ({
  batchAssignments: [],

  assignBatch: (assignment) => {
    // Remove any existing batch assignment for this student and subject
    const filteredAssignments = get().batchAssignments.filter(
      a => !(a.studentId === assignment.studentId && a.subjectId === assignment.subjectId)
    );

    const newAssignment: BatchAssignment = {
      id: Date.now().toString(),
      ...assignment,
      createdAt: new Date().toISOString(),
    };

    set({
      batchAssignments: [...filteredAssignments, newAssignment],
    });
  },

  removeBatchAssignment: (studentId, subjectId) => {
    set(state => ({
      batchAssignments: state.batchAssignments.filter(
        a => !(a.studentId === studentId && a.subjectId === subjectId)
      ),
    }));
  },

  getBatchAssignments: (teacherId, subjectId, class_) => {
    return get().batchAssignments.filter(
      a => a.teacherId === teacherId && 
           a.subjectId === subjectId && 
           a.class === class_
    );
  },

  getStudentBatch: (studentId, subjectId) => {
    const assignment = get().batchAssignments.find(
      a => a.studentId === studentId && a.subjectId === subjectId
    );
    return assignment ? assignment.batchNumber : null;
  },
}));