import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Exam } from '../../../types/exam';
import { getExams } from '../../../lib/api/exams';
import ExamForm from './components/ExamForm';
import QuestionBank from './components/QuestionBank';
import QuestionForm from './components/QuestionForm';
import { Icons } from '../../../components/icons';

const ExamManagement = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [exams, setExams] = useState<Exam[]>([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      loadExams();
    }
  }, [subjectId]);

  const loadExams = async () => {
    try {
      const data = await getExams(subjectId!);
      setExams(data);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowQuestionForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Question
          </button>
          <button
            onClick={() => setShowExamForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Exams</h2>
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 text-gray-900">{exam.duration_minutes} minutes</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Marks:</span>
                  <span className="ml-2 text-gray-900">{exam.total_marks}</span>
                </div>
                <div>
                  <span className="text-gray-500">Start:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(exam.start_time).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">End:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(exam.end_time).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-indigo-600 hover:text-indigo-800">
                  <Icons.Pencil className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Question Bank */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Question Bank</h2>
          <QuestionBank
            subjectId={subjectId!}
            onSelectQuestion={() => {}}
          />
        </div>
      </div>

      {showExamForm && (
        <ExamForm
          subjectId={subjectId!}
          onClose={() => setShowExamForm(false)}
          onSuccess={loadExams}
        />
      )}

      {showQuestionForm && (
        <QuestionForm
          subjectId={subjectId!}
          onClose={() => setShowQuestionForm(false)}
          onSuccess={loadExams}
        />
      )}
    </div>
  );
};

export default ExamManagement;