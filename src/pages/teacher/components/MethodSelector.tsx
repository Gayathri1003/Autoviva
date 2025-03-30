// src/pages/teacher/components/MethodSelector.tsx
import { Dispatch, SetStateAction } from 'react';

interface MethodSelectorProps {
  method: 'topic' | 'document' | 'manual';
  setMethod: Dispatch<SetStateAction<'topic' | 'document' | 'manual'>>;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ method, setMethod }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Question Generation Method
      </label>
      <div className="flex space-x-4">
        <button
          onClick={() => setMethod('topic')}
          className={`px-4 py-2 rounded-lg ${
            method === 'topic'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Topic-Based
        </button>
        <button
          onClick={() => setMethod('document')}
          className={`px-4 py-2 rounded-lg ${
            method === 'document'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Document-Based
        </button>
        <button
          onClick={() => setMethod('manual')}
          className={`px-4 py-2 rounded-lg ${
            method === 'manual'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manual Entry
        </button>
      </div>
    </div>
  );
};

export default MethodSelector;