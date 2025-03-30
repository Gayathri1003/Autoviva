import React from 'react';
import { Icons } from '../../../components/icons';

interface LoginFormProps {
  username: string;
  password: string;
  selectedRole: 'admin' | 'teacher' | 'student';
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  selectedRole,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icons.User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={selectedRole === 'teacher' ? "Enter your teacher ID" : "Enter your username"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icons.Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;