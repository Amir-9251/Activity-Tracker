import React from 'react';
import { useAppContext } from '../context/AppContext';

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
    <div className="dashboard-grid grid grid-cols-1 gap-6 max-w-4xl mx-auto p-4">
      <div className="timer-card bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <div className="timer-header flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
              Active Time
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">Track your productive hours</p>
          </div>
        </div>
        <div
          className="timer-display relative flex items-center justify-center min-h-[320px] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          onClick={isTracking ? stopTracking : startTracking}
        >
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
              className="text-slate-700/50"
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
              className={`transition-all duration-1000 ease-in-out ${isTracking ? 'text-sky-400' : 'text-emerald-400'}`}
            />
          </svg>
          {/* Timer display */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="time-display text-3xl font-bold mb-3 flex items-center">
              <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent min-w-[50px] text-center">
                {hours.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-400 mx-2">:</span>
              <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent min-w-[50px] text-center">
                {minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-400 mx-2">:</span>
              <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent min-w-[50px] text-center">
                {seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="timer-label text-slate-400 text-sm font-medium tracking-wider uppercase">
              {isTracking ? 'Click to Stop' : 'Click to Start'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 