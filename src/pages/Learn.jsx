import { Code, Clock, Zap } from 'lucide-react';

export default function Learn() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Learn Shortest Path Algorithms
                </h1>

                {/* Dijkstra's Algorithm */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                        Dijkstra's Algorithm
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Dijkstra's algorithm is a greedy algorithm that finds the shortest path from a source node
                                to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue
                                to always process the node with the smallest known distance.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Time Complexity</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">O(E log V) with priority queue</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="text-blue-600 dark:text-blue-400" size={20} />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Space Complexity</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">O(V)</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Code className="text-blue-600 dark:text-blue-400" size={20} />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Approach</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">Greedy</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                                {`function Dijkstra(Graph, source):
    dist[source] ← 0
    for each vertex v in Graph:
        if v ≠ source:
            dist[v] ← INFINITY
        add v to Q
    
    while Q is not empty:
        u ← vertex in Q with min dist[u]
        remove u from Q
        
        for each neighbor v of u:
            alt ← dist[u] + weight(u, v)
            if alt < dist[v]:
                dist[v] ← alt
                previous[v] ← u
    
    return dist, previous`}
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Use Cases</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                <li>GPS navigation and route planning</li>
                                <li>Network routing protocols (OSPF)</li>
                                <li>Social network analysis</li>
                                <li>Robotics path planning</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Floyd-Warshall Algorithm */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-purple-600 mb-4">
                        Floyd-Warshall Algorithm
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Overview</h3>
                            <p className="text-gray-700">
                                Floyd-Warshall algorithm finds shortest paths between all pairs of vertices
                                in a weighted graph. It uses dynamic programming to compute distances through
                                intermediate vertices, building up the solution iteratively.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="text-purple-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Time Complexity</h4>
                                </div>
                                <p className="text-gray-700">O(V³)</p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="text-purple-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Space Complexity</h4>
                                </div>
                                <p className="text-gray-700">O(V²)</p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Code className="text-purple-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Approach</h4>
                                </div>
                                <p className="text-gray-700">Dynamic Programming</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pseudocode</h3>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                {`function FloydWarshall(Graph):
    // Initialize distance matrix
    for each vertex i:
        for each vertex j:
            if i == j:
                dist[i][j] ← 0
            else if edge (i,j) exists:
                dist[i][j] ← weight(i,j)
            else:
                dist[i][j] ← INFINITY
    
    // Main algorithm
    for k from 1 to |V|:
        for i from 1 to |V|:
            for j from 1 to |V|:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] ← dist[i][k] + dist[k][j]
    
    return dist`}
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Use Cases</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Finding shortest paths in dense graphs</li>
                                <li>Transitive closure of directed graphs</li>
                                <li>Network optimization and routing</li>
                                <li>Game theory and decision making</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Algorithm Comparison
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-gray-900 dark:text-white">Feature</th>
                                    <th className="px-4 py-3 text-gray-900 dark:text-white">Dijkstra's</th>
                                    <th className="px-4 py-3 text-gray-900">Floyd-Warshall</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Time Complexity</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">O(E log V)</td>
                                    <td className="px-4 py-3 text-gray-700">O(V³)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900">Problem Type</td>
                                    <td className="px-4 py-3 text-gray-700">Single-source</td>
                                    <td className="px-4 py-3 text-gray-700">All-pairs</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900">Space Complexity</td>
                                    <td className="px-4 py-3 text-gray-700">O(V)</td>
                                    <td className="px-4 py-3 text-gray-700">O(V²)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Approach</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Greedy</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Dynamic Programming</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900">Best For</td>
                                    <td className="px-4 py-3 text-gray-700">Single path, sparse graphs</td>
                                    <td className="px-4 py-3 text-gray-700">All paths, dense graphs</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
