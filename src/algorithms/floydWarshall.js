/**
 * Floyd-Warshall Algorithm
 * Finds shortest paths between all pairs of vertices
 * Returns all D matrices for solution display
 */

export default function* floydWarshall(nodes, edges, sourceNode = null, destNode = null) {
    const n = nodes.length;
    const nodeIds = nodes.map(node => node.id);
    const nodeIndexMap = {};
    nodeIds.forEach((id, index) => {
        nodeIndexMap[id] = index;
    });

    // Initialize distance matrix (D⁰)
    const INF = Infinity;
    const dist = Array(n).fill(null).map(() => Array(n).fill(INF));
    const next = Array(n).fill(null).map(() => Array(n).fill(null));

    // Set diagonal to 0
    for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
    }

    // Set edge weights
    edges.forEach(edge => {
        const u = nodeIndexMap[edge.source];
        const v = nodeIndexMap[edge.target];
        const weight = edge.data.weight;

        dist[u][v] = weight;
        next[u][v] = v;

        // For undirected graph
        dist[v][u] = weight;
        next[v][u] = u;
    });

    // Store all D matrices for solution display
    const matrices = [];

    // D⁰ - Initial matrix
    matrices.push({
        k: -1,
        label: 'D⁰ (Initial)',
        matrix: dist.map(row => [...row]),
        description: 'Initial distance matrix with direct edge weights'
    });

    // Yield initial state
    yield {
        nodes: nodes.map(node => ({
            ...node,
            data: { ...node.data, state: 'unvisited', distance: INF }
        })),
        edges: edges.map(edge => ({
            ...edge,
            data: { ...edge.data, state: 'default' }
        })),
        description: 'Initial graph state',
        currentMatrix: matrices[0]
    };

    // Floyd-Warshall main algorithm
    for (let k = 0; k < n; k++) {
        const intermediateNode = nodeIds[k];
        let updated = false;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                    updated = true;
                }
            }
        }

        // Store Dᵏ matrix
        matrices.push({
            k: k,
            label: `D${k + 1} (via vertex ${intermediateNode})`,
            matrix: dist.map(row => [...row]),
            description: `Using vertex ${intermediateNode} as intermediate vertex`,
            intermediateVertex: intermediateNode,
            pivotRow: k,
            pivotCol: k
        });

        // Yield step with highlighted intermediate vertex
        yield {
            nodes: nodes.map(node => ({
                ...node,
                data: {
                    ...node.data,
                    state: node.id === intermediateNode ? 'processing' : 'visited',
                    distance: 0
                }
            })),
            edges: edges.map(edge => ({
                ...edge,
                data: { ...edge.data, state: 'visited' }
            })),
            description: `Iteration ${k + 1}: Using vertex ${intermediateNode} as intermediate`,
            currentMatrix: matrices[matrices.length - 1],
            allMatrices: matrices
        };
    }

    // Final state - highlight shortest path if source and dest are provided
    let finalNodes = nodes.map(node => ({
        ...node,
        data: { ...node.data, state: 'visited', distance: 0 }
    }));

    let finalEdges = edges.map(edge => ({
        ...edge,
        data: { ...edge.data, state: 'default' }
    }));

    let pathDescription = 'All-pairs shortest paths computed';

    if (sourceNode && destNode) {
        const srcIdx = nodeIndexMap[sourceNode];
        const dstIdx = nodeIndexMap[destNode];
        const shortestDist = dist[srcIdx][dstIdx];

        // Reconstruct path
        const path = [];
        if (next[srcIdx][dstIdx] !== null) {
            let curr = srcIdx;
            path.push(nodeIds[curr]);
            while (curr !== dstIdx) {
                curr = next[curr][dstIdx];
                path.push(nodeIds[curr]);
            }
        }

        // Highlight path
        finalNodes = nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                state: path.includes(node.id) ? 'path' : 'visited',
                distance: node.id === sourceNode ? 0 : (node.id === destNode ? shortestDist : 0)
            }
        }));

        finalEdges = edges.map(edge => {
            const isInPath = path.some((nodeId, idx) => {
                if (idx < path.length - 1) {
                    return (edge.source === nodeId && edge.target === path[idx + 1]) ||
                        (edge.target === nodeId && edge.source === path[idx + 1]);
                }
                return false;
            });
            return {
                ...edge,
                data: { ...edge.data, state: isInPath ? 'path' : 'default' }
            };
        });

        pathDescription = `Shortest path from ${sourceNode} to ${destNode}: ${path.join(' → ')} (Distance: ${shortestDist === INF ? '∞' : shortestDist})`;
    }

    // Yield final state
    yield {
        nodes: finalNodes,
        edges: finalEdges,
        description: pathDescription,
        allMatrices: matrices,
        finalMatrix: matrices[matrices.length - 1],
        distanceMatrix: dist,
        nextMatrix: next,
        nodeIds: nodeIds
    };
}
