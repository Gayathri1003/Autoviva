import React from 'react';

interface SubjectHeaderProps {
  subjectName: string;
  subjectCode: string;
  isLab: boolean;
}

const SubjectHeader: React.FC<SubjectHeaderProps> = ({ subjectName, subjectCode, isLab }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subjectName}</h1>
          <p className="text-gray-500">{subjectCode}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isLab
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {isLab ? 'Lab' : 'Theory'}
        </span>
      </div>
    </div>
  );
};

export default SubjectHeader;