import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import RoleSelector from './components/RoleSelector';
import LoginForm from './components/LoginForm';
import PasswordSetupForm from './components/PasswordSetupForm';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const navigate = useNavigate();
  const { login, setUser, setPassword: setUserPassword } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await login(username, password, selectedRole);
      
      if (user.requiresPasswordSetup) {
        setIsSettingPassword(true);
        toast.success('Please set your password for first-time login');
        return;
      }

      setUser(user);
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/teachers');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student/exams');
          break;
      }
      
      toast.success('Login successful');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid username or password');
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await setUserPassword(username, newPassword, selectedRole as 'teacher' | 'student');
      toast.success('Password set successfully');
      
      // Log in with the new password
      const user = await login(username, newPassword, selectedRole);
      setUser(user);
      
      // Redirect to appropriate dashboard
      if (selectedRole === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student/exams');
      }
    } catch (error) {
      toast.error('Failed to set password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          College Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSettingPassword ? 'Set Your Password' : 'Please select your role and sign in'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isSettingPassword ? (
            <>
              <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
              />
              <div className="mt-6">
                <LoginForm
                  username={username}
                  password={password}
                  selectedRole={selectedRole}
                  onUsernameChange={setUsername}
                  onPasswordChange={setPassword}
                  onSubmit={handleLogin}
                />
              </div>
            </>
          ) : (
            <PasswordSetupForm
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSetPassword}
            />
          )}

          {selectedRole === 'admin' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Default Admin Credentials</span>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Username: admin</p>
                <p>Password: admin123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;