import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BookOpen, BarChart3 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Visualize Shortest Path
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Algorithms
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Interactive visualization of Dijkstra's and Floyd Warshall algorithms.
                        Watch step-by-step how these algorithms find the shortest path in weighted graphs.
                    </p>
                    <Link
                        to="/visualizer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        Start Visualizing
                        <ArrowRight size={24} />
                    </Link>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Interactive Visualization
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Create custom graphs, add weighted edges, and watch algorithms work in real-time with step-by-step animation.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Learn Algorithms
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Understand time complexity, pseudocode, and use cases for Dijkstra's and Bellman-Ford algorithms.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                            <BarChart3 className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Compare Performance
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Run multiple algorithms on the same graph and compare their performance, steps, and efficiency.
                        </p>
                    </div>
                </div>

                {/* What You'll Learn */}
                <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        What You'll Learn
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Dijkstra's Algorithm</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Greedy algorithm for finding shortest paths with non-negative weights. Time: O(E log V)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Bellman-Ford Algorithm</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Dynamic programming approach that handles negative weights. Time: O(VE)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex-shrink-0 mt-1"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Graph Theory Basics</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Understand nodes, edges, weights, and how graphs represent real-world problems
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-600 rounded-full flex-shrink-0 mt-1"></div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Algorithm Complexity</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Learn to analyze time and space complexity of different approaches
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
