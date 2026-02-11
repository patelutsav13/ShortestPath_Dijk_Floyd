import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls as FlowControls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge as addReactFlowEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '../../store/graphStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export default function GraphCanvas({ nodes: propNodes, edges: propEdges, isInteractive = true }) {
    const { nodes: storeNodes, edges: storeEdges, steps, currentStepIndex, addNode } = useGraphStore();

    // Use props if provided, otherwise use store
    const effectiveNodes = propNodes || storeNodes;
    const effectiveEdges = propEdges || storeEdges;

    const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
    const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);

    // Update React Flow nodes/edges when store changes or props change
    useEffect(() => {
        try {
            // If props are provided, use them directly (read-only mode)
            if (propNodes && propEdges) {
                setReactFlowNodes(propNodes);
                setReactFlowEdges(propEdges);
                return;
            }

            // Otherwise check steps from store
            if (steps.length > 0 && currentStepIndex < steps.length) {
                const currentStep = steps[currentStepIndex];

                // Validate step data before using it
                if (currentStep && Array.isArray(currentStep.nodes) && Array.isArray(currentStep.edges)) {
                    setReactFlowNodes(currentStep.nodes);
                    setReactFlowEdges(currentStep.edges);
                } else {
                    console.warn('Invalid step data at index', currentStepIndex, currentStep);
                    // Fallback to original nodes/edges
                    setReactFlowNodes(storeNodes);
                    setReactFlowEdges(storeEdges);
                }
            } else {
                setReactFlowNodes(storeNodes);
                setReactFlowEdges(storeEdges);
            }
        } catch (error) {
            console.error('Error updating graph canvas:', error);
            // Fallback to original nodes/edges on error
            setReactFlowNodes(effectiveNodes);
            setReactFlowEdges(effectiveEdges);
        }
    }, [propNodes, propEdges, storeNodes, storeEdges, steps, currentStepIndex, setReactFlowNodes, setReactFlowEdges, effectiveNodes, effectiveEdges]);

    const onConnect = useCallback((params) => {
        const weight = prompt('Enter edge weight:', '1');
        if (weight && !isNaN(weight)) {
            useGraphStore.getState().addEdge(params.source, params.target, parseInt(weight));
        }
    }, []);

    const onPaneClick = useCallback((event) => {
        // Add node on double click
        if (event.detail === 2) {
            const bounds = event.currentTarget.getBoundingClientRect();
            const position = {
                x: event.clientX - bounds.left - 30,
                y: event.clientY - bounds.top - 30,
            };
            addNode(position);
        }
    }, [addNode]);

    return (
        <div className="w-full h-full bg-gray-50">
            <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                className="bg-gradient-to-br from-gray-50 to-gray-100"
            >
                <Background color="#aaa" gap={16} />
                <FlowControls />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.data?.state) {
                            case 'visiting': return '#facc15';
                            case 'visited': return '#60a5fa';
                            case 'path': return '#22c55e';
                            case 'processing': return '#a855f7';
                            default: return '#e5e7eb';
                        }
                    }}
                />
            </ReactFlow>
        </div>
    );
}
