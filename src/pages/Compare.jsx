import { useState } from 'react';
import { useGraphStore } from '../store/graphStore';

export default function Compare() {
    const { nodes, edges, generateRandomGraph } = useGraphStore();
    const [results, setResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const runComparison = async () => {
        if (nodes.length === 0) {
            alert('Please create a graph first or generate a random graph');
            return;
        }

        const source = nodes[0].id;
        const dest = nodes[nodes.length - 1].id;

        setIsRunning(true);

        // Run Dijkstra
        const dijkstraModule = await import('../algorithms/dijkstra.js');
        const dijkstraGen = dijkstraModule.default(nodes, edges, source, dest);
        const dijkstraSteps = [];
        const dijkstraStart = performance.now();
        for (const step of dijkstraGen) {
            dijkstraSteps.push(step);
        }
        const dijkstraTime = performance.now() - dijkstraStart;

        // Run Floyd-Warshall
        const floydModule = await import('../algorithms/floydWarshall.js');
        const floydGen = floydModule.default(nodes, edges, source, dest);
        const floydSteps = [];
        const floydStart = performance.now();
        for (const step of floydGen) {
            floydSteps.push(step);
        }
        const floydTime = performance.now() - floydStart;

        const dijkstraFinal = dijkstraSteps[dijkstraSteps.length - 1];
        const floydFinal = floydSteps[floydSteps.length - 1];

        const sourceIdx = nodes.findIndex(n => n.id === source);
        const destIdx = nodes.findIndex(n => n.id === dest);

        setResults({
            dijkstra: {
                steps: dijkstraSteps.length,
                time: dijkstraTime.toFixed(2),
                pathLength: dijkstraFinal.distanceTable[dest],
            },
            floydWarshall: {
                steps: floydSteps.length,
                time: floydTime.toFixed(2),
                pathLength: floydFinal.distanceMatrix ? floydFinal.distanceMatrix[sourceIdx][destIdx] : Infinity,
            },
            source,
            dest,
        });

        setIsRunning(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Algorithm Comparison
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Setup
                    </h2>

                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Compare the performance of Dijkstra's and Floyd-Warshall algorithms on the same graph.
                            The comparison will show the number of steps, execution time, and final path length.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => generateRandomGraph(15)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Generate Random Graph
                            </button>

                            <button
                                onClick={runComparison}
                                disabled={isRunning || nodes.length === 0}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                            >
                                {isRunning ? 'Running...' : 'Run Comparison'}
                            </button>
                        </div>

                        {nodes.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Current graph: {nodes.length} nodes, {edges.length} edges
                            </p>
                        )}
                    </div>
                </div>

                {results && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Comparison Results
                        </h2>

                        <div className="mb-4 text-gray-700">
                            <p><strong>Source Node:</strong> {results.source}</p>
                            <p><strong>Destination Node:</strong> {results.dest}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-gray-900">Metric</th>
                                        <th className="px-4 py-3 text-gray-900">Dijkstra's</th>
                                        <th className="px-4 py-3 text-gray-900">Floyd-Warshall</th>
                                        <th className="px-4 py-3 text-gray-900">Winner</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-gray-900">Steps</td>
                                        <td className="px-4 py-3 text-gray-700">{results.dijkstra.steps}</td>
                                        <td className="px-4 py-3 text-gray-700">{results.floydWarshall.steps}</td>
                                        <td className="px-4 py-3">
                                            {results.dijkstra.steps < results.floydWarshall.steps ? (
                                                <span className="text-green-600 font-semibold">Dijkstra's</span>
                                            ) : results.dijkstra.steps > results.floydWarshall.steps ? (
                                                <span className="text-green-600 font-semibold">Floyd-Warshall</span>
                                            ) : (
                                                <span className="text-gray-600">Tie</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-gray-900">Execution Time (ms)</td>
                                        <td className="px-4 py-3 text-gray-700">{results.dijkstra.time}</td>
                                        <td className="px-4 py-3 text-gray-700">{results.floydWarshall.time}</td>
                                        <td className="px-4 py-3">
                                            {parseFloat(results.dijkstra.time) < parseFloat(results.floydWarshall.time) ? (
                                                <span className="text-green-600 font-semibold">Dijkstra's</span>
                                            ) : parseFloat(results.dijkstra.time) > parseFloat(results.floydWarshall.time) ? (
                                                <span className="text-green-600 font-semibold">Floyd-Warshall</span>
                                            ) : (
                                                <span className="text-gray-600">Tie</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-gray-900">Path Length</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {results.dijkstra.pathLength === Infinity ? '∞' : results.dijkstra.pathLength}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {results.floydWarshall.pathLength === Infinity ? '∞' : results.floydWarshall.pathLength}
                                        </td>
                                        <td className="px-4 py-3">
                                            {results.dijkstra.pathLength === results.floydWarshall.pathLength ? (
                                                <span className="text-green-600 font-semibold">Same ✓</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Different ✗</span>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Analysis</h3>
                            <p className="text-sm text-blue-800">
                                {results.dijkstra.pathLength === results.floydWarshall.pathLength
                                    ? '✅ Both algorithms found the same shortest path, confirming correctness.'
                                    : '⚠️ Different path lengths detected. This may indicate an error.'}
                            </p>
                            <p className="text-sm text-blue-800 mt-2">
                                Dijkstra's algorithm completed in {results.dijkstra.steps} steps vs Floyd-Warshall's {results.floydWarshall.steps} steps.
                                {parseFloat(results.dijkstra.time) < parseFloat(results.floydWarshall.time)
                                    ? ' Dijkstra\'s was faster, as expected for single-source shortest path.'
                                    : ' Floyd-Warshall computes all-pairs shortest paths, so it may take longer.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
