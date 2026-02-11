import { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export default function GraphInputModal({ isOpen, onClose, onGenerate }) {
    const [numNodes, setNumNodes] = useState('');
    const [nodeNames, setNodeNames] = useState('');
    const [edgeList, setEdgeList] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');

    const validateAndGenerate = () => {
        const validationErrors = [];
        setErrors([]);
        setSuccess('');

        // Validate number of nodes
        const nodeCount = parseInt(numNodes);
        if (!numNodes || isNaN(nodeCount) || nodeCount < 2) {
            validationErrors.push('Number of nodes must be at least 2');
        }

        // Parse and validate node names
        const names = nodeNames.split(',').map(n => n.trim()).filter(n => n);
        if (names.length === 0) {
            validationErrors.push('Please enter node names (comma-separated)');
        } else if (names.length !== nodeCount) {
            validationErrors.push(`Number of node names (${names.length}) must match total nodes (${nodeCount})`);
        }

        // Check for duplicate node names
        const uniqueNames = new Set(names);
        if (uniqueNames.size !== names.length) {
            validationErrors.push('Duplicate node names found. Each node must have a unique name.');
        }

        // Parse and validate edges
        const edges = edgeList.split('\n').map(line => line.trim()).filter(line => line);
        const edgeSet = new Set();
        const parsedEdges = [];

        edges.forEach((edge, index) => {
            const parts = edge.split(/\s+/);
            if (parts.length !== 3) {
                validationErrors.push(`Line ${index + 1}: Invalid format. Use "NodeA NodeB Cost" (e.g., "A B 5")`);
                return;
            }

            const [source, target, costStr] = parts;
            const cost = parseFloat(costStr);

            // Validate nodes exist
            if (!names.includes(source)) {
                validationErrors.push(`Line ${index + 1}: Node "${source}" not found in node names`);
            }
            if (!names.includes(target)) {
                validationErrors.push(`Line ${index + 1}: Node "${target}" not found in node names`);
            }

            // Validate cost
            if (isNaN(cost) || cost <= 0) {
                validationErrors.push(`Line ${index + 1}: Cost must be a positive number`);
            }

            // Check for parallel edges (same edge entered twice)
            const edgeKey1 = `${source}-${target}`;
            const edgeKey2 = `${target}-${source}`;
            if (edgeSet.has(edgeKey1) || edgeSet.has(edgeKey2)) {
                validationErrors.push(`Line ${index + 1}: Duplicate edge between "${source}" and "${target}"`);
            } else {
                edgeSet.add(edgeKey1);
                edgeSet.add(edgeKey2);
                parsedEdges.push({ source, target, cost });
            }
        });

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // All validations passed
        setSuccess('Graph validated successfully!');

        // Generate graph after a short delay to show success message
        setTimeout(() => {
            onGenerate(names, parsedEdges);
            handleClose();
        }, 500);
    };

    const handleClose = () => {
        setNumNodes('');
        setNodeNames('');
        setEdgeList('');
        setErrors([]);
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Create Custom Graph</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Number of Nodes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Number of Nodes *
                        </label>
                        <input
                            type="number"
                            min="2"
                            value={numNodes}
                            onChange={(e) => setNumNodes(e.target.value)}
                            placeholder="e.g., 5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Node Names */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Node Names (comma-separated) *
                        </label>
                        <input
                            type="text"
                            value={nodeNames}
                            onChange={(e) => setNodeNames(e.target.value)}
                            placeholder="e.g., A, B, C, D, E"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter unique names for each node, separated by commas
                        </p>
                    </div>

                    {/* Edge List */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Edge List (one per line) *
                        </label>
                        <textarea
                            value={edgeList}
                            onChange={(e) => setEdgeList(e.target.value)}
                            placeholder="Format: NodeA NodeB Cost&#10;Example:&#10;A B 5&#10;B C 3&#10;A C 7"
                            rows="8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Format: <code className="bg-gray-100 px-1 rounded">Source Target Cost</code> (e.g., "A B 5")
                        </p>
                    </div>

                    {/* Example */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">Example:</h3>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>Total Nodes:</strong> 4</p>
                            <p><strong>Node Names:</strong> A, B, C, D</p>
                            <p><strong>Edges:</strong></p>
                            <pre className="bg-blue-100 p-2 rounded mt-1 font-mono text-xs">
                                A B 4{'\n'}A C 2{'\n'}B C 1{'\n'}B D 5{'\n'}C D 3
                            </pre>
                        </div>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-900 mb-2">Validation Errors:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={20} />
                                <p className="text-green-900 font-semibold">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={validateAndGenerate}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md transition-colors"
                        >
                            Generate Graph
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
