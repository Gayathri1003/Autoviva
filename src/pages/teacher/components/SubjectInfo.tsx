import React from 'react';
import { Icons } from '../../../components/icons';

interface SubjectInfoProps {
  department: string;
  semester: number;
  class: string;
}

const SubjectInfo: React.FC<SubjectInfoProps> = ({ department, semester, class: classValue }) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-6">
      <div className="flex items-center text-gray-600">
        <Icons.BookOpen className="w-5 h-5 mr-2" />
        <span>{department}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Icons.GraduationCap className="w-5 h-5 mr-2" />
        <span>Semester {semester}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Icons.Users className="w-5 h-5 mr-2" />
        <span>Class {classValue}</span>
      </div>
    </div>
  );
};

export default SubjectInfo;