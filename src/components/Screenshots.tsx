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
            <div className="stats-card bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                <div className="stats-grid grid grid-cols-1 gap-4">
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

            <div className="activity-card bg-slate-800 rounded-xl p-6 shadow-lg">
                <div className="card-header flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Activity Log</h2>
                    <button
                        className="btn-icon p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                        onClick={clearActivityLogs}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="activity-log max-h-64 overflow-y-auto pr-2">
                    {activityLogs.map((log) => (
                        <div key={log.id} className="activity-item py-2 border-b border-slate-700 last:border-none">
                            <div className="activity-time text-sm text-emerald-400">{log.time}</div>
                            <div className="activity-description mt-1">{log.description}</div>
                        </div>
                    ))}

                    {activityLogs.length === 0 && (
                        <div className="py-4 text-center text-slate-500">
                            No activity recorded yet
                        </div>
                    )}
                </div>
            </div>

            <div className="screenshots-card bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Recent Screenshots</h2>
                <div className="screenshots-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {screenshots.slice(-8).map((screenshot, index) => (
                        <div
                            key={index}
                            className="screenshot-item relative"
                        >
                            <img
                                src={getScreenshotPath(screenshot.path)}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="screenshot-time absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                {new Date(screenshot.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    {screenshots.length === 0 && (
                        <div className="col-span-full py-4 text-center text-slate-500">
                            No screenshots captured yet
                        </div>
                    )}
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
    <div className="stat-card bg-slate-900 rounded-lg p-4">
        <div className="flex items-center space-x-3">
            {icon}
            <div>
                <div className="text-2xl font-semibold">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
            </div>
        </div>
    </div>
);

export default Screenshots; 