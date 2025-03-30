import React from 'react';

interface QuestionFiltersProps {
  filters: {
    batch: string;
    semester: string;
    difficulty: string;
  };
  onChange: (filters: any) => void;
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Filters</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Batch</label>
          <select
            value={filters.batch}
            onChange={(e) => onChange({ ...filters, batch: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Batches</option>
            {['A', 'B', 'C', 'D'].map((batch) => (
              <option key={batch} value={batch}>Batch {batch}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <select
            value={filters.semester}
            onChange={(e) => onChange({ ...filters, semester: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilters;