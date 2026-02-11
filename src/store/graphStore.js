import { create } from 'zustand';

export const useGraphStore = create((set, get) => ({
    // Graph data
    nodes: [],
    edges: [],

    // Algorithm state
    selectedAlgorithm: null,
    sourceNode: null,
    destNode: null,

    // Animation state
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1000, // milliseconds per step

    // UI state
    isAddingEdge: false,
    tempEdgeStart: null,

    // Actions
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    addNode: (position) => {
        const nodes = get().nodes;
        const newId = `${nodes.length + 1}`;
        const newNode = {
            id: newId,
            type: 'custom',
            position,
            data: {
                label: newId,
                distance: Infinity,
                state: 'unvisited'
            }
        };
        set({ nodes: [...nodes, newNode] });
    },

    addEdge: (source, target, weight) => {
        const edges = get().edges;
        const edgeId = `e${source}-${target}`;
        const reverseEdgeId = `e${target}-${source}`;

        // Check if edge already exists (undirected graph)
        const exists = edges.some(e => e.id === edgeId || e.id === reverseEdgeId);
        if (exists) return;

        const newEdge = {
            id: edgeId,
            source,
            target,
            type: 'custom',
            data: {
                weight: weight || 1,
                state: 'default'
            }
        };
        set({ edges: [...edges, newEdge] });
    },

    removeNode: (id) => {
        const { nodes, edges } = get();
        set({
            nodes: nodes.filter(n => n.id !== id),
            edges: edges.filter(e => e.source !== id && e.target !== id)
        });
    },

    removeEdge: (id) => {
        const edges = get().edges;
        set({ edges: edges.filter(e => e.id !== id) });
    },

    updateEdgeWeight: (id, weight) => {
        const edges = get().edges;
        set({
            edges: edges.map(e => e.id === id ? { ...e, data: { ...e.data, weight } } : e)
        });
    },

    setAlgorithm: (algo) => set({ selectedAlgorithm: algo, steps: [], currentStepIndex: 0 }),
    setSource: (id) => set({ sourceNode: id }),
    setDest: (id) => set({ destNode: id }),

    runAlgorithm: () => {
        const { selectedAlgorithm, nodes, edges, sourceNode, destNode } = get();
        if (!selectedAlgorithm || !sourceNode || !destNode) {
            alert('Please select algorithm, source, and destination nodes');
            return;
        }

        // Import algorithm dynamically
        import(`../algorithms/${selectedAlgorithm}.js`).then(module => {
            const generator = module.default(nodes, edges, sourceNode, destNode);
            const steps = [];
            for (const step of generator) {
                steps.push(step);
            }
            set({ steps, currentStepIndex: 0, isPlaying: false });
        });
    },

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),

    stepForward: () => {
        const { currentStepIndex, steps } = get();
        if (currentStepIndex < steps.length - 1) {
            set({ currentStepIndex: currentStepIndex + 1 });
        }
    },

    stepBackward: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
            set({ currentStepIndex: currentStepIndex - 1 });
        }
    },

    reset: () => set({
        currentStepIndex: 0,
        isPlaying: false,
        steps: [],
        nodes: get().nodes.map(n => ({
            ...n,
            data: { ...n.data, distance: Infinity, state: 'unvisited' }
        })),
        edges: get().edges.map(e => ({
            ...e,
            data: { ...e.data, state: 'default' }
        }))
    }),

    setSpeed: (speed) => set({ speed }),

    generateRandomGraph: (nodeCount = 10) => {
        const nodes = [];
        const edges = [];

        // Create nodes in a circular layout
        const radius = 200;
        const centerX = 400;
        const centerY = 300;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodes.push({
                id: `${i + 1}`,
                type: 'custom',
                position: { x, y },
                data: {
                    label: `${i + 1}`,
                    distance: Infinity,
                    state: 'unvisited'
                }
            });
        }

        // Create random edges
        const edgeCount = Math.floor(nodeCount * 1.5);
        for (let i = 0; i < edgeCount; i++) {
            const source = Math.floor(Math.random() * nodeCount) + 1;
            let target = Math.floor(Math.random() * nodeCount) + 1;

            while (target === source) {
                target = Math.floor(Math.random() * nodeCount) + 1;
            }

            const weight = Math.floor(Math.random() * 10) + 1;
            const edgeId = `e${source}-${target}`;
            const reverseEdgeId = `e${target}-${source}`;

            // Check if edge already exists
            const exists = edges.some(e => e.id === edgeId || e.id === reverseEdgeId);
            if (!exists) {
                edges.push({
                    id: edgeId,
                    source: `${source}`,
                    target: `${target}`,
                    type: 'custom',
                    data: {
                        weight,
                        state: 'default'
                    }
                });
            }
        }

        set({ nodes, edges, steps: [], currentStepIndex: 0, sourceNode: null, destNode: null });
    },

    createCustomGraph: (nodeNames, edgeList) => {
        const nodes = [];
        const edges = [];

        // Create nodes in a circular layout
        const radius = 200;
        const centerX = 400;
        const centerY = 300;
        const nodeCount = nodeNames.length;

        nodeNames.forEach((name, i) => {
            const angle = (i / nodeCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodes.push({
                id: name,
                type: 'custom',
                position: { x, y },
                data: {
                    label: name,
                    distance: Infinity,
                    state: 'unvisited'
                }
            });
        });

        // Create edges
        edgeList.forEach(({ source, target, cost }) => {
            const edgeId = `e${source}-${target}`;
            edges.push({
                id: edgeId,
                source: source,
                target: target,
                type: 'custom',
                data: {
                    weight: cost,
                    state: 'default'
                }
            });
        });

        set({ nodes, edges, steps: [], currentStepIndex: 0, sourceNode: null, destNode: null });
    },

    clearGraph: () => set({
        nodes: [],
        edges: [],
        steps: [],
        currentStepIndex: 0,
        sourceNode: null,
        destNode: null,
        selectedAlgorithm: null
    }),

    setTempEdgeStart: (nodeId) => set({ tempEdgeStart: nodeId, isAddingEdge: true }),
    clearTempEdge: () => set({ tempEdgeStart: null, isAddingEdge: false }),
}));
