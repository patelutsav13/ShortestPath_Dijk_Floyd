import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';
import { graphAPI } from '../services/api';
import { useGraphStore } from '../store/graphStore';
import { Save, Trash2, Play, Clock, GitBranch, AlertCircle } from 'lucide-react';

export default function SavedGraphs() {
    const navigate = useNavigate();
    const { setNodes, setEdges } = useGraphStore();
    const [graphs, setGraphs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

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

    const handleLoadGraph = async (graphId) => {
        try {
            const response = await graphAPI.getGraph(graphId);
            const graph = response.data;

            // Load graph into store
            setNodes(graph.nodes);
            setEdges(graph.edges);

            // Navigate to visualizer
            navigate('/visualizer');
        } catch (error) {
            console.error('Error loading graph:', error);
            alert('Failed to load graph');
        }
    };

    const handleDeleteGraph = async (graphId) => {
        if (!confirm('Are you sure you want to delete this graph?')) {
            return;
        }

        setDeleting(graphId);
        try {
            await graphAPI.deleteGraph(graphId);
            setGraphs(graphs.filter((g) => g._id !== graphId));
        } catch (error) {
            console.error('Error deleting graph:', error);
            alert('Failed to delete graph');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <UserSidebar />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Saved Graphs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and load your saved graph configurations
                    </p>
                </div>

                {/* Graphs Grid */}
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
                            Create and save graphs from the visualizer to see them here
                        </p>
                        <button
                            onClick={() => navigate('/visualizer')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <GitBranch className="w-5 h-5" />
                            Go to Visualizer
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {graphs.map((graph) => (
                            <div
                                key={graph._id}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                {/* Graph Info */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                        {graph.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <GitBranch className="w-4 h-4" />
                                            {graph.nodes.length} nodes
                                        </span>
                                        <span>{graph.edges.length} edges</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {new Date(graph.updatedAt).toLocaleDateString()} at{' '}
                                        {new Date(graph.updatedAt).toLocaleTimeString()}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleLoadGraph(graph._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                                    >
                                        <Play className="w-4 h-4" />
                                        Load
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGraph(graph._id)}
                                        disabled={deleting === graph._id}
                                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                                    >
                                        {deleting === graph._id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
