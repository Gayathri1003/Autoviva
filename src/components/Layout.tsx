import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Menu, X, User as UserIcon, BookOpen, Users, GraduationCap, Layers } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Users, label: 'Manage Teachers', path: '/admin/teachers' },
          { icon: GraduationCap, label: 'Manage Students', path: '/admin/students' },
          { icon: BookOpen, label: 'Assign Subjects', path: '/admin/subjects' },
        ];
      case 'teacher':
        return [
          { icon: BookOpen, label: 'Dashboard', path: '/teacher' },
          { icon: Layers, label: 'Batch Management', path: '/teacher/batches' },
          { icon: Users, label: 'View Results', path: '/teacher/results' },
        ];
      case 'student':
        return [
          { icon: BookOpen, label: 'Exam Portal', path: '/student/exams' },
          { icon: GraduationCap, label: 'View Results', path: '/student/results' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xl font-semibold text-white">CMS Portal</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-2">
            {getNavItems().map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-700"
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-700"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;