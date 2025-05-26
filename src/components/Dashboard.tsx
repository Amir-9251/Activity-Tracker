import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Square } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    isTracking,
    startTracking,
    stopTracking,
    hours,
    minutes,
    seconds,
  } = useAppContext();

  // Calculate progress percentage for the circular indicator
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const progress = (totalSeconds % 3600) / 3600; // Progress within the hour
  const circumference = 2 * Math.PI * 120; // 2πr where r = 120
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="dashboard-grid grid grid-cols-1 gap-6 max-w-4xl mx-auto">
      <div className="timer-card bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl">
        <div className="timer-header flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Active Time
            </h2>
            <p className="text-slate-400 text-sm mt-1">Track your productive hours</p>
          </div>
          <div className="timer-controls flex gap-3">
            <button
              className={`btn flex items-center px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${isTracking
                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                }`}
              onClick={startTracking}
              disabled={isTracking}
            >
              <Play size={18} className="mr-2" />
              <span className="text-sm font-medium">Start</span>
            </button>
            <button
              className={`btn flex items-center px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${!isTracking
                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20'
                }`}
              onClick={stopTracking}
              disabled={!isTracking}
            >
              <Square size={18} className="mr-2" />
              <span className="text-sm font-medium">Stop</span>
            </button>
          </div>
        </div>
        <div className="timer-display relative flex items-center justify-center min-h-[320px]">
          {/* Circular progress indicator */}
          <svg className="w-64 h-64 -rotate-90 transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-sky-400 transition-all duration-1000 ease-in-out"
            />
          </svg>
          {/* Timer display */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="time-display text-2xl font-bold mb-2 flex items-center">
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent min-w-[40px] text-center">
                {hours.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-400 mx-1">:</span>
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent min-w-[40px] text-center">
                {minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-400 mx-1">:</span>
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent min-w-[40px] text-center">
                {seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="timer-label text-slate-400 text-sm font-medium tracking-wide">
              Today's Session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 