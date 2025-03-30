import React from 'react';
import { Icons } from '../../../components/icons';

type Role = 'admin' | 'teacher' | 'student';

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleSelect: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Select Role
      </label>
      <div className="mt-1 grid grid-cols-3 gap-3">
        {(['admin', 'teacher', 'student'] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onRoleSelect(role)}
            className={`
              flex flex-col items-center justify-center p-3 border rounded-lg
              ${selectedRole === role
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <Icons.UserCircle className="w-6 h-6 mb-1" />
            <span className="text-sm capitalize">{role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;