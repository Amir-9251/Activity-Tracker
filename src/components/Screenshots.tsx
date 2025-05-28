import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Camera, Clock, Trash2 } from 'lucide-react';

const Screenshots: React.FC = () => {
    const {
        screenshotsCount,
        lastActivity,
        screenshots,
        activityLogs,
        clearActivityLogs
    } = useAppContext();

    // Function to get the full path for a screenshot
    const getScreenshotPath = (relativePath: string) => {
        // In development, use the relative path directly
        if (process.env.NODE_ENV === 'development') {
            return relativePath;
        }
        // In production, use the app's protocol
        return `file://${relativePath}`;
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">Statistics</h2>
                <div className="stats-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        icon={<Camera size={20} className="text-sky-400" />}
                        value={screenshotsCount.toString()}
                        label="Screenshots"
                    />
                    <StatCard
                        icon={<Clock size={20} className="text-emerald-400" />}
                        value={lastActivity}
                        label="Last Activity"
                    />
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">Screenshots</h2>
                    <button
                        onClick={clearActivityLogs}
                        className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20 flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        <span>Clear All</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {screenshots.map((screenshot, index) => (
                        <div key={index} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
                            <img
                                src={getScreenshotPath(screenshot.path)}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-48 object-cover rounded-xl mb-3"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">
                                    {new Date(screenshot.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    {new Date(screenshot.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <div className="stat-card bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
        <div className="flex items-center space-x-4">
            {icon}
            <div>
                <div className="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{value}</div>
                <div className="text-sm text-slate-400 font-medium">{label}</div>
            </div>
        </div>
    </div>
);

export default Screenshots; 