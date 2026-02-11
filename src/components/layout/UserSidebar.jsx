import { User, LogOut, LayoutDashboard, Save, GitBranch } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function UserSidebar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: GitBranch, label: 'Visualizer', path: '/visualizer' },
        { icon: Save, label: 'Saved Graphs', path: '/saved-graphs' },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hi,</p>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {user?.username || 'User'}
                        </h3>
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
