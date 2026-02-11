import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = memo(({ data }) => {
    const stateColors = {
        unvisited: 'bg-gray-200 dark:bg-gray-700 border-gray-400',
        visiting: 'bg-yellow-400 dark:bg-yellow-500 border-yellow-600 shadow-lg ring-4 ring-yellow-300',
        visited: 'bg-blue-400 dark:bg-blue-500 border-blue-600',
        path: 'bg-green-500 dark:bg-green-600 border-green-700 shadow-xl ring-4 ring-green-300'
    };

    return (
        <div className={`px-5 py-4 rounded-full border-3 ${stateColors[data.state]} transition-all duration-300 min-w-[60px]`}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-600" />

            <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">{data.label}</div>
                <div className="text-xs mt-1 font-semibold text-gray-700 dark:text-gray-200">
                    {data.distance === Infinity ? '∞' : data.distance}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-600" />
        </div>
    );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
