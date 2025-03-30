import React from 'react';
import { Icons } from '../../../components/icons';

interface QuickActionsProps {
  onGenerateQuestions: () => void;
  onViewResults: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onGenerateQuestions, onViewResults }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <button
          onClick={onGenerateQuestions}
          className="w-full flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
        >
          <div className="flex items-center">
            <Icons.FileText className="w-5 h-5 text-indigo-600 mr-3" />
            <span className="text-indigo-600 font-medium">Generate Questions</span>
          </div>
        </button>
        <button
          onClick={onViewResults}
          className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100"
        >
          <div className="flex items-center">
            <Icons.ChartBar className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-600 font-medium">View Results</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;