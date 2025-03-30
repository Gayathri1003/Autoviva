import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useExamStore } from '../../store/examStore';

const ResultsView = () => {
  const { user } = useAuthStore();
  const { getStudentResults } = useExamStore();

  const results = getStudentResults(user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Results</h1>

      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No results available yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{result.examTitle}</h2>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Questions:</span>
                    <span className="font-medium">{result.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Correct Answers:</span>
                    <span className="font-medium text-green-600">{result.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Wrong Answers:</span>
                    <span className="font-medium text-red-600">{result.wrongAnswers}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.status === 'pass' ? 'bg-green-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      result.status === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.percentage}%
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      result.status === 'pass'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status === 'pass' ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Submitted: {new Date(result.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsView;