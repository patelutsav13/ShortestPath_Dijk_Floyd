import { Link, useLocation } from 'react-router-dom';
import { GitBranch, Menu, X, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Visualizer', path: '/visualizer' },
        { name: 'Map', path: '/map' },
        { name: 'Learn', path: '/learn' },
        { name: 'Compare', path: '/compare' },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <GitBranch className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">
                                Shortest Path
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${location.pathname === link.path
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    <User className="w-4 h-4" />
                                    {user?.username}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${location.pathname === link.path
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    {user?.username}
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
