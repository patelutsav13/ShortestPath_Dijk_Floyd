import { memo } from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

const CustomEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const stateColors = {
        default: 'stroke-gray-400 stroke-2',
        relaxing: 'stroke-yellow-500 stroke-[4]',
        path: 'stroke-green-500 stroke-[5]'
    };

    return (
        <>
            <path
                id={id}
                className={`${stateColors[data.state]} transition-all duration-300 fill-none`}
                d={edgePath}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-sm font-bold shadow-md"
                >
                    {data.weight}
                </div>
            </EdgeLabelRenderer>
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
