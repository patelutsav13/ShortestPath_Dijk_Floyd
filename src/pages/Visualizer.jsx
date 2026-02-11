import GraphCanvas from '../components/visualizer/GraphCanvas';
import Controls from '../components/visualizer/Controls';
import Sidebar from '../components/visualizer/Sidebar';

export default function Visualizer() {
    return (
        <div className="h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 p-4">
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Sidebar - Controls */}
                <div className="lg:col-span-3 overflow-y-auto">
                    <Controls />
                </div>

                {/* Main Canvas */}
                <div className="lg:col-span-6 h-full rounded-lg overflow-hidden shadow-xl">
                    <GraphCanvas />
                </div>

                {/* Right Sidebar - Algorithm Info */}
                <div className="lg:col-span-3 overflow-y-auto">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
