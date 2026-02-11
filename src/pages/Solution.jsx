import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGraphStore } from '../store/graphStore';
import useAuthStore from '../store/authStore';
import { graphAPI } from '../services/api';
import { ArrowLeft, Book, Save, X, CheckCircle } from 'lucide-react';
import GraphCanvas from '../components/visualizer/GraphCanvas';

export default function Solution() {
    const navigate = useNavigate();
    const { selectedAlgorithm, steps, nodes, edges } = useGraphStore();
    const { isAuthenticated } = useAuthStore();

    // Save Graph State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [graphName, setGraphName] = useState('');
    const [saving, setSaving] = useState(false);

    if (!selectedAlgorithm || steps.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/visualizer')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Visualizer
                    </button>
                    <div className="bg-white rounded-lg p-12 text-center shadow-lg">
                        <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Solution Available</h2>
                        <p className="text-gray-600 mb-6">
                            Please run an algorithm in the visualizer first to see the solution.
                        </p>
                        <button
                            onClick={() => navigate('/visualizer')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            Go to Visualizer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const lastStep = steps[steps.length - 1];
    const algorithmName = selectedAlgorithm === 'dijkstra' ? "Dijkstra's Algorithm" : "Floyd-Warshall Algorithm";

    const handleSaveGraph = async () => {
        if (!graphName.trim()) {
            alert('Please enter a graph name');
            return;
        }

        setSaving(true);
        try {
            await graphAPI.createGraph({
                name: graphName,
                nodes,
                edges
            });
            alert('Graph saved successfully!');
            setShowSaveModal(false);
            setGraphName('');
        } catch (error) {
            console.error('Error saving graph:', error);
            alert('Failed to save graph. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/visualizer')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft size={20} />
                        Back to Visualizer
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors shadow-md"
                        >
                            <Save size={18} />
                            Save Graph
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{algorithmName}</h1>
                    <p className="text-gray-600">Step-by-step textbook solution</p>
                </div>

                {/* Final Result & Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Final Answer Text */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 shadow-md">
                        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                            <CheckCircle size={24} />
                            Final Answer
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-white bg-opacity-60 p-4 rounded-md">
                                <p className="text-lg text-green-800 font-medium">
                                    {lastStep.description}
                                </p>
                            </div>

                            {selectedAlgorithm === 'dijkstra' && lastStep.distanceTable && (
                                <div className="text-sm text-green-700">
                                    <p>The shortest path has been found. The table below details the step-by-step process.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final Graph Visualization */}
                    <div className="h-[400px] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative">
                        <div className="absolute top-2 left-2 z-10 bg-white/80 px-2 py-1 rounded text-xs font-semibold text-gray-500">
                            Final Graph State
                        </div>
                        <GraphCanvas
                            nodes={lastStep.nodes}
                            edges={lastStep.edges}
                            isInteractive={false}
                        />
                    </div>
                </div>

                {/* Algorithm-specific solution display */}
                {selectedAlgorithm === 'dijkstra' ? (
                    <DijkstraSolution steps={steps} nodes={nodes} />
                ) : (
                    <FloydWarshallSolution steps={steps} nodes={nodes} lastStep={lastStep} />
                )}
            </div>

            {/* Save Graph Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Save Graph</h3>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Graph Name
                            </label>
                            <input
                                type="text"
                                value={graphName}
                                onChange={(e) => setGraphName(e.target.value)}
                                placeholder="Enter graph name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGraph}
                                disabled={saving || !graphName.trim()}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-md transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Dijkstra's Algorithm Solution Display
function DijkstraSolution({ steps, nodes }) {
    const nodeIds = nodes.map(n => n.id).sort();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Distance Table (Step-by-Step)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <th className="border border-gray-300 px-4 py-3 text-left">Iteration</th>
                                <th className="border border-gray-300 px-4 py-3 text-left">Action</th>
                                <th className="border border-gray-300 px-4 py-3 text-left">Selected Node</th>
                                {nodeIds.map(nodeId => (
                                    <th key={nodeId} className="border border-gray-300 px-4 py-3 text-center">
                                        Node {nodeId}
                                    </th>
                                ))}
                                <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => {
                                const distTable = step.distanceTable || {};
                                const isSelection = step.type === 'SELECTION';
                                const isUpdate = step.type === 'UPDATE';
                                const rowClass = isSelection ? 'bg-blue-50' : (isUpdate ? 'bg-green-50' : 'bg-white');

                                return (
                                    <tr key={index} className={rowClass}>
                                        <td className="border border-gray-300 px-4 py-3 font-semibold">{index}</td>
                                        <td className="border border-gray-300 px-4 py-3 font-semibold text-sm">
                                            {isSelection ? (
                                                <span className="text-blue-700">Select Min</span>
                                            ) : isUpdate ? (
                                                <span className="text-green-700">Update</span>
                                            ) : step.type || 'Init'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {step.currentNode ? (
                                                <span className={`px-2 py-1 rounded font-semibold ${isSelection ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {step.currentNode}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        {nodeIds.map(nodeId => {
                                            const dist = distTable[nodeId];
                                            const isInfinity = dist === Infinity;
                                            // Highlight updated value
                                            const isTarget = step.targetNode === nodeId && isUpdate;

                                            return (
                                                <td key={nodeId} className={`border border-gray-300 px-4 py-3 text-center font-mono ${isTarget ? 'bg-green-200 font-bold' : ''}`}>
                                                    {isInfinity ? '∞' : dist}
                                                </td>
                                            );
                                        })}
                                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                                            {step.description}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Floyd-Warshall Algorithm Solution Display
function FloydWarshallSolution({ steps, nodes, lastStep }) {
    const allMatrices = lastStep.allMatrices || [];
    const nodeIds = lastStep.nodeIds || nodes.map(n => n.id).sort();

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">About Floyd-Warshall Algorithm</h3>
                <p className="text-blue-800">
                    Floyd-Warshall finds shortest paths between all pairs of vertices.
                    Each D<sup>k</sup> matrix shows distances after considering vertices 1 through k as intermediate vertices.
                </p>
                <p className="text-blue-800 mt-2">
                    <strong>Textbook Rule:</strong> For matrix D<sup>k</sup>, the k-th row and k-th column from the previous matrix remain unchanged (highlighted in blue).
                </p>
            </div>

            {/* All D Matrices */}
            {allMatrices.map((matrixData, idx) => {
                const isPivot = matrixData.pivotRow !== undefined;
                return (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{matrixData.label}</h2>
                        <p className="text-gray-600 mb-4">{matrixData.description}</p>

                        <div className="overflow-x-auto">
                            <table className="border-collapse mx-auto">
                                <thead>
                                    <tr>
                                        <th className="border-2 border-gray-400 bg-gray-200 px-4 py-2 font-bold"></th>
                                        {nodeIds.map((nodeId, colIdx) => {
                                            // Highlight pivot column header
                                            const isPivotCol = isPivot && colIdx === matrixData.pivotCol;
                                            return (
                                                <th key={nodeId} className={`border-2 border-gray-400 px-4 py-2 font-bold text-white ${isPivotCol ? 'bg-orange-500 ring-2 ring-orange-300' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                                                    {nodeId}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {matrixData.matrix.map((row, i) => {
                                        // Highlight pivot row header
                                        const isPivotRow = isPivot && i === matrixData.pivotRow;
                                        return (
                                            <tr key={i}>
                                                <td className={`border-2 border-gray-400 px-4 py-2 font-bold text-white text-center ${isPivotRow ? 'bg-orange-500 ring-2 ring-orange-300' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                                                    {nodeIds[i]}
                                                </td>
                                                {row.map((value, j) => {
                                                    const isInfinity = value === Infinity;
                                                    const prevValue = idx > 0 ? allMatrices[idx - 1].matrix[i][j] : null;
                                                    const isUpdated = prevValue !== null && prevValue !== value;

                                                    // Highlight cells in pivot row or pivot column
                                                    const isPivotCell = isPivot && (i === matrixData.pivotRow || j === matrixData.pivotCol);

                                                    // Styling classes
                                                    let cellClass = 'bg-white';
                                                    if (isUpdated) cellClass = 'bg-yellow-200 font-bold';
                                                    else if (isPivotCell) cellClass = 'bg-blue-100 border-blue-400 font-semibold'; // "Rounded" / Unchanged
                                                    else if (i === j) cellClass = 'bg-gray-100';

                                                    return (
                                                        <td
                                                            key={j}
                                                            className={`border-2 border-gray-400 px-4 py-2 text-center font-mono text-lg ${cellClass}`}
                                                        >
                                                            {isInfinity ? '∞' : value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {matrixData.intermediateVertex && (
                            <div className="mt-4 p-3 bg-purple-50 border border-purple-300 rounded">
                                <p className="text-purple-900">
                                    <strong>Intermediate Vertex:</strong> {matrixData.intermediateVertex}
                                    <br />
                                    <span className="inline-block w-3 h-3 bg-yellow-200 border border-gray-400 mr-1"></span> Updated values
                                    <br />
                                    <span className="inline-block w-3 h-3 bg-blue-100 border border-gray-400 mr-1"></span> Fixed Row/Column (Textbook Rule)
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
