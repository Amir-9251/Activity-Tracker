import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Square, Camera, Clock, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    isTracking,
    startTracking,
    stopTracking,
    hours,
    minutes,
    seconds,
    screenshotsCount,
    lastActivity,
    screenshots,
    activityLogs,
    clearActivityLogs
  } = useAppContext();

  // Log screenshots whenever they change
  useEffect(() => {
    if (screenshots.length > 0) {
      console.log('Screenshots:', screenshots);
    }
  }, [screenshots]);

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
    <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="timer-card bg-slate-800 rounded-xl p-6 shadow-lg col-span-full md:col-span-2">
        <div className="timer-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Time</h2>
          <div className="timer-controls flex gap-3">
            <button
              className={`btn flex items-center px-3 py-1.5 rounded-full transition-all duration-200 ${isTracking
                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500/90 hover:bg-emerald-500 text-white hover:scale-105'
                }`}
              onClick={startTracking}
              disabled={isTracking}
            >
              <Play size={16} className="mr-1.5" />
              <span className="text-sm font-medium">Start</span>
            </button>
            <button
              className={`btn flex items-center px-3 py-1.5 rounded-full transition-all duration-200 ${!isTracking
                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                : 'bg-rose-500/90 hover:bg-rose-500 text-white hover:scale-105'
                }`}
              onClick={stopTracking}
              disabled={!isTracking}
            >
              <Square size={16} className="mr-1.5" />
              <span className="text-sm font-medium">Stop</span>
            </button>
          </div>
        </div>
        <div className="timer-display bg-slate-900 rounded-lg p-6 flex flex-col items-center">
          <div className="time-display text-5xl font-bold text-sky-400 mb-2">
            <span>{hours}</span>:
            <span>{minutes}</span>:
            <span>{seconds}</span>
          </div>
          <div className="timer-label text-slate-400">Today's Session</div>
        </div>
      </div>

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

      <div className="activity-card bg-slate-800 rounded-xl p-6 shadow-lg col-span-full">
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

      <div className="screenshots-card bg-slate-800 rounded-xl p-6 shadow-lg col-span-full">
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

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="stat-card bg-slate-900 rounded-lg p-4 flex items-center">
      <div className="stat-icon p-3 rounded-full bg-slate-800 mr-4">
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value text-xl font-semibold">{value}</div>
        <div className="stat-label text-sm text-slate-400">{label}</div>
      </div>
    </div>
  );
};

export default Dashboard; 