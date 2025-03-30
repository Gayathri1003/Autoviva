// src/pages/teacher/SubjectList.tsx
import { useNavigate } from 'react-router-dom';

const SubjectList = () => {
  const navigate = useNavigate();
  const subjects = [
    { id: '123', name: 'Data Structures' },
    { id: '456', name: 'Algorithms' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Select a Subject</h1>
      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <button
              onClick={() => navigate(`/teacher/subject/${subject.id}/questions`)}
              className="text-blue-600 hover:underline"
            >
              {subject.name} - Generate Questions
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;