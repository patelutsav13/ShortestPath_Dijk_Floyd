import { Github, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        © 2026 Shortest Path Visualizer. DAA University Viva Project.
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Github size={20} />
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            Made with <Heart size={16} className="text-red-500" fill="currentColor" /> for learning
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
