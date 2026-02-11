import { useGraphStore } from '../../store/graphStore';

export default function Sidebar() {
    const { steps, currentStepIndex, selectedAlgorithm } = useGraphStore();

    const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg space-y-4 overflow-y-auto max-h-[600px]">
            <h3 className="text-lg font-bold text-gray-900">Algorithm Progress</h3>

            {currentStep ? (
                <>
                    {/* Current Step Description */}
                    <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="font-semibold text-blue-900 mb-1">Current Step:</h4>
                        <p className="text-sm text-blue-800">{currentStep.description || 'Processing...'}</p>
                    </div>

                    {/* Distance Table - Only for Dijkstra */}
                    {selectedAlgorithm === 'dijkstra' && currentStep.distanceTable && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Distance Table:</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(currentStep.distanceTable).map(([nodeId, distance]) => (
                                    <div
                                        key={nodeId}
                                        className={`flex justify-between items-center px-3 py-2 rounded-md ${currentStep.currentNode === nodeId
                                                ? 'bg-yellow-100 border-2 border-yellow-500'
                                                : 'bg-gray-100'
                                            }`}
                                    >
                                        <span className="font-semibold text-gray-900">Node {nodeId}:</span>
                                        <span className="text-gray-700">
                                            {distance === Infinity ? '∞' : distance}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Floyd-Warshall Info */}
                    {selectedAlgorithm === 'floydWarshall' && (
                        <div className="bg-purple-50 p-3 rounded-md">
                            <h4 className="font-semibold text-purple-900 mb-2">Floyd-Warshall Progress:</h4>
                            <p className="text-sm text-purple-800">
                                Computing all-pairs shortest paths using dynamic programming.
                            </p>
                            {currentStep.currentMatrix && (
                                <p className="text-sm text-purple-700 mt-2">
                                    Current: {currentStep.currentMatrix.label}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Algorithm Info */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="font-semibold text-gray-900 mb-2">Algorithm Info:</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                                <span>Visiting/Processing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                                <span>Visited</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span>Shortest Path</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                <span>Intermediate Vertex</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>Select an algorithm and run it to see the visualization</p>
                </div>
            )}
        </div>
    );
}
