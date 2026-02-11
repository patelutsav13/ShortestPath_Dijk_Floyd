import { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Save, X, Book, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGraphStore } from '../../store/graphStore';
import useAuthStore from '../../store/authStore';
import { graphAPI } from '../../services/api';
import GraphInputModal from './GraphInputModal';

export default function Controls() {
    const navigate = useNavigate();
    const {
        selectedAlgorithm,
        sourceNode,
        destNode,
        nodes,
        edges,
        steps,
        currentStepIndex,
        isPlaying,
        speed,
        setAlgorithm,
        setSource,
        setDest,
        runAlgorithm,
        play,
        pause,
        stepForward,
        stepBackward,
        reset,
        setSpeed,
        generateRandomGraph,
        createCustomGraph,
        clearGraph,
    } = useGraphStore();

    const { isAuthenticated } = useAuthStore();
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [graphName, setGraphName] = useState('');
    const [saving, setSaving] = useState(false);

    // Auto-play animation
    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            const timer = setTimeout(() => {
                stepForward();
            }, speed);
            return () => clearTimeout(timer);
        } else if (isPlaying && currentStepIndex >= steps.length - 1) {
            pause();
        }
    }, [isPlaying, currentStepIndex, steps.length, speed, stepForward, pause]);

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
                edges,
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
        <>
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Controls</h3>

                {/* Algorithm Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Algorithm
                    </label>
                    <select
                        value={selectedAlgorithm || ''}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    >
                        <option value="">Select Algorithm</option>
                        <option value="dijkstra">Dijkstra's Algorithm</option>
                        <option value="floydWarshall">Floyd-Warshall Algorithm</option>
                    </select>
                </div>

                {/* Source Node Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Node
                    </label>
                    <select
                        value={sourceNode || ''}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    >
                        <option value="">Select Source</option>
                        {nodes.map(node => (
                            <option key={node.id} value={node.id}>Node {node.id}</option>
                        ))}
                    </select>
                </div>

                {/* Destination Node Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Node
                    </label>
                    <select
                        value={destNode || ''}
                        onChange={(e) => setDest(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    >
                        <option value="">Select Destination</option>
                        {nodes.map(node => (
                            <option key={node.id} value={node.id}>Node {node.id}</option>
                        ))}
                    </select>
                </div>

                {/* Run Algorithm Button */}
                <button
                    onClick={runAlgorithm}
                    disabled={!selectedAlgorithm || !sourceNode || !destNode}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-md transition-colors"
                >
                    Run Algorithm
                </button>

                {/* Animation Controls */}
                {steps.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between gap-2">
                            <button
                                onClick={stepBackward}
                                disabled={currentStepIndex === 0}
                                className="p-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-md transition-colors"
                            >
                                <SkipBack size={20} />
                            </button>

                            <button
                                onClick={isPlaying ? pause : play}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            <button
                                onClick={stepForward}
                                disabled={currentStepIndex >= steps.length - 1}
                                className="p-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-md transition-colors"
                            >
                                <SkipForward size={20} />
                            </button>

                            <button
                                onClick={reset}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>

                        <div className="text-sm text-center text-gray-600">
                            Step {currentStepIndex + 1} of {steps.length}
                        </div>

                        {/* Speed Control */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speed: {(2000 / speed).toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="500"
                                max="2000"
                                step="100"
                                value={2000 - speed + 500}
                                onChange={(e) => setSpeed(2500 - parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {/* Graph Actions */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                    {steps.length > 0 && (
                        <button
                            onClick={() => navigate('/solution')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-md transition-colors"
                        >
                            <Book size={18} />
                            View Solution
                        </button>
                    )}

                    {isAuthenticated && nodes.length > 0 && (
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-md transition-colors"
                        >
                            <Save size={18} />
                            Save Graph
                        </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => generateRandomGraph(10)}
                            className="px-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors text-sm"
                        >
                            Random Graph
                        </button>

                        <button
                            onClick={() => setShowInputModal(true)}
                            className="flex items-center justify-center gap-1 px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors text-sm"
                        >
                            <PlusCircle size={16} />
                            Custom Graph
                        </button>
                    </div>

                    <button
                        onClick={clearGraph}
                        className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors"
                    >
                        Clear Graph
                    </button>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    💡 Double-click canvas to add nodes<br />
                    💡 Drag from node to node to add edges
                </div>
            </div>

            {/* Custom Graph Input Modal */}
            <GraphInputModal
                isOpen={showInputModal}
                onClose={() => setShowInputModal(false)}
                onGenerate={createCustomGraph}
            />

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

                        <div className="text-sm text-gray-600 mb-4">
                            <p>Nodes: {nodes.length}</p>
                            <p>Edges: {edges.length}</p>
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
        </>
    );
}
