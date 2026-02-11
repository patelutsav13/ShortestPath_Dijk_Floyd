import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';
import useAuthStore from '../store/authStore';
import { graphAPI } from '../services/api';
import { TrendingUp, GitBranch, Save, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const [graphs, setGraphs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGraphs();
    }, []);

    const fetchGraphs = async () => {
        try {
            const response = await graphAPI.getGraphs();
            setGraphs(response.data);
        } catch (error) {
            console.error('Error fetching graphs:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            icon: Save,
            label: 'Saved Graphs',
            value: graphs.length,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: GitBranch,
            label: 'Algorithms Run',
            value: graphs.length * 2,
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: TrendingUp,
            label: 'Success Rate',
            value: '100%',
            color: 'from-green-500 to-emerald-500',
        },
    ];

    const quickActions = [
        {
            title: 'Start Visualizing',
            description: 'Create and visualize shortest path algorithms',
            icon: GitBranch,
            path: '/visualizer',
            color: 'from-blue-500 to-purple-600',
        },
        {
            title: 'Learn Algorithms',
            description: 'Understand Dijkstra and Floyd-Warshall',
            icon: TrendingUp,
            path: '/learn',
            color: 'from-purple-500 to-pink-600',
        },
        {
            title: 'Saved Graphs',
            description: 'View and manage your saved graphs',
            icon: Save,
            path: '/saved-graphs',
            color: 'from-green-500 to-teal-600',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <UserSidebar />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your algorithm visualizations
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={index}
                                    to={action.path}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                                        {action.title}
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Graphs */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Graphs</h2>
                    {loading ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading graphs...</p>
                        </div>
                    ) : graphs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                            <Save className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No saved graphs yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start by creating your first graph in the visualizer
                            </p>
                            <Link
                                to="/visualizer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                            >
                                <GitBranch className="w-5 h-5" />
                                Go to Visualizer
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {graphs.slice(0, 6).map((graph) => (
                                <div
                                    key={graph._id}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                        {graph.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <span>{graph.nodes.length} nodes</span>
                                        <span>{graph.edges.length} edges</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {new Date(graph.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
