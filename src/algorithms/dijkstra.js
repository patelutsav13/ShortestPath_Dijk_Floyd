class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(nodeId, distance) {
        this.items.push({ nodeId, distance });
        this.items.sort((a, b) => a.distance - b.distance);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    updatePriority(nodeId, newDistance) {
        const index = this.items.findIndex(item => item.nodeId === nodeId);
        if (index !== -1) {
            this.items[index].distance = newDistance;
            this.items.sort((a, b) => a.distance - b.distance);
        }
    }
}

export default function* dijkstraGenerator(nodes, edges, sourceId, destId) {
    // Initialize distances
    const distances = {};
    const previous = {};
    const visited = new Set();
    const pq = new PriorityQueue();

    // Build adjacency list
    const adjacency = {};

    nodes.forEach(node => {
        distances[node.id] = node.id === sourceId ? 0 : Infinity;
        previous[node.id] = null;
        adjacency[node.id] = [];
    });

    edges.forEach(edge => {
        adjacency[edge.source].push({
            nodeId: edge.target,
            weight: edge.data.weight,
            edgeId: edge.id
        });
        // For undirected graph
        adjacency[edge.target].push({
            nodeId: edge.source,
            weight: edge.data.weight,
            edgeId: edge.id
        });
    });

    pq.enqueue(sourceId, 0);

    // STEP 1: Initialization
    yield {
        description: `Initialized distances. Source node ${sourceId} has distance 0, all others have distance ∞.`,
        nodes: nodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                distance: distances[n.id],
                state: n.id === sourceId ? 'visiting' : 'unvisited'
            }
        })),
        edges: edges.map(e => ({ ...e, data: { ...e.data, state: 'default' } })),
        currentNode: sourceId,
        distanceTable: { ...distances }
    };

    // Main algorithm loop
    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        const currentId = current.nodeId;

        if (visited.has(currentId)) continue;
        visited.add(currentId);

        // STEP: Select Node (Textbook: Select unvisited node with min distance)
        yield {
            type: 'SELECTION',
            description: `Selected Node ${currentId} (Minimum Distance: ${distances[currentId] === Infinity ? '∞' : distances[currentId]})`,
            nodes: nodes.map(n => ({
                ...n,
                data: {
                    ...n.data,
                    distance: distances[n.id],
                    state: visited.has(n.id) ? 'visited' : (n.id === currentId ? 'visiting' : 'unvisited')
                }
            })),
            edges: edges.map(e => ({ ...e, data: { ...e.data, state: 'default' } })),
            currentNode: currentId,
            distanceTable: { ...distances }
        };

        // If we reached destination, we can stop
        if (currentId === destId) break;

        // Relax edges
        for (const neighbor of adjacency[currentId]) {
            if (visited.has(neighbor.nodeId)) continue;

            const newDist = distances[currentId] + neighbor.weight;

            // Check if update is needed
            if (newDist < distances[neighbor.nodeId]) {
                const oldDist = distances[neighbor.nodeId];
                distances[neighbor.nodeId] = newDist;
                previous[neighbor.nodeId] = currentId;
                pq.updatePriority(neighbor.nodeId, newDist);

                // STEP: Edge Relaxation (Textbook: Update neighbor distance if shorter path found)
                yield {
                    type: 'UPDATE',
                    description: `Updated Node ${neighbor.nodeId}: dist[${neighbor.nodeId}] = min(${oldDist === Infinity ? '∞' : oldDist}, ${distances[currentId]} + ${neighbor.weight}) = ${newDist}`,
                    nodes: nodes.map(n => ({
                        ...n,
                        data: {
                            ...n.data,
                            distance: distances[n.id],
                            state: n.id === neighbor.nodeId ? 'visiting' : (visited.has(n.id) ? 'visited' : 'unvisited')
                        }
                    })),
                    edges: edges.map(e => ({
                        ...e,
                        data: {
                            ...e.data,
                            state: e.id === neighbor.edgeId ? 'relaxing' : 'default'
                        }
                    })),
                    currentNode: currentId,
                    targetNode: neighbor.nodeId,
                    distanceTable: { ...distances }
                };
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = destId;

    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    // Find edges in path
    const pathEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
        const edge = edges.find(e =>
            (e.source === path[i] && e.target === path[i + 1]) ||
            (e.target === path[i] && e.source === path[i + 1])
        );
        if (edge) pathEdges.add(edge.id);
    }

    // FINAL STEP: Show shortest path
    yield {
        description: `Shortest path found: ${path.join(' → ')} with total distance ${distances[destId]}`,
        nodes: nodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                distance: distances[n.id],
                state: path.includes(n.id) ? 'path' : 'visited'
            }
        })),
        edges: edges.map(e => ({
            ...e,
            data: {
                ...e.data,
                state: pathEdges.has(e.id) ? 'path' : 'default'
            }
        })),
        currentNode: destId,
        distanceTable: { ...distances }
    };
}
