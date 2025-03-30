import React from 'react';

interface StudentFiltersProps {
  filters: {
    department: string;
    semester: string;
    class: string;
  };
  onChange: (filters: any) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({ filters, onChange }) => {
  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
  ];

  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
  const classOptions = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Filter Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
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
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            value={filters.class}
            onChange={(e) => onChange({ ...filters, class: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Classes</option>
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                Class {classOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;