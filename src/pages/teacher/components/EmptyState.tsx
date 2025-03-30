import React from 'react';
import { Icons } from '../../../components/icons';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Icons.BookOpen className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects assigned</h3>
      <p className="mt-1 text-sm text-gray-500">
        You haven't been assigned any subjects yet.
      </p>
    </div>
  );
};

export default EmptyState;