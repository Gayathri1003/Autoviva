import React from 'react';
import { Icons } from '../../../components/icons';

interface Method {
  id: 'upload' | 'manual' | 'topic';
  icon: keyof typeof Icons;
  title: string;
  description: string;
}

interface MethodSelectorProps {
  onSelect: (method: Method['id']) => void;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ onSelect }) => {
  const methods: Method[] = [
    {
      id: 'upload',
      icon: 'Upload',
      title: 'Upload Document',
      description: 'Generate questions from a document',
    },
    {
      id: 'manual',
      icon: 'Plus',
      title: 'Manual Entry',
      description: 'Create questions manually',
    },
    {
      id: 'topic',
      icon: 'BookOpen',
      title: 'Topic Based',
      description: 'Generate questions from a topic',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {methods.map((method) => {
        const Icon = Icons[method.icon];
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Icon className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{method.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{method.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default MethodSelector;