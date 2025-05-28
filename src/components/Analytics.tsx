import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Timer, Sun, Moon, TrendingUp, LogIn, LogOut, Calendar, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  const { screenshots, checkInTime, checkOutTime } = useAppContext();

  // Calculate total tracking time based on actual intervals
  const calculateTotalTime = () => {
    if (screenshots.length < 2) return '0m';

    // Sort screenshots by timestamp
    const sortedScreenshots = [...screenshots].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate total time by summing up intervals between consecutive screenshots
    let totalMs = 0;
    for (let i = 0; i < sortedScreenshots.length - 1; i++) {
      const current = new Date(sortedScreenshots[i].timestamp);
      const next = new Date(sortedScreenshots[i + 1].timestamp);
      totalMs += next.getTime() - current.getTime();
    }

    const minutes = Math.floor(totalMs / (1000 * 60));
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Calculate active time based on screenshot intervals
  const calculateActiveTime = () => {
    if (screenshots.length < 2) return '0m';

    // Sort screenshots by timestamp
    const sortedScreenshots = [...screenshots].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let totalActiveMs = 0;
    const maxGap = 5 * 60 * 1000; // 5 minutes gap threshold

    for (let i = 0; i < sortedScreenshots.length - 1; i++) {
      const current = new Date(sortedScreenshots[i].timestamp);
      const next = new Date(sortedScreenshots[i + 1].timestamp);
      const gap = next.getTime() - current.getTime();

      if (gap <= maxGap) {
        totalActiveMs += gap;
      }
    }

    const minutes = Math.floor(totalActiveMs / (1000 * 60));
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Calculate time distribution with more precise periods
  const calculateTimeDistribution = () => {
    const periods = {
      earlyMorning: 0, // 5-8
      morning: 0,      // 8-12
      afternoon: 0,    // 12-17
      evening: 0,      // 17-21
      night: 0         // 21-5
    };

    screenshots.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      if (hour >= 5 && hour < 8) periods.earlyMorning++;
      else if (hour >= 8 && hour < 12) periods.morning++;
      else if (hour >= 12 && hour < 17) periods.afternoon++;
      else if (hour >= 17 && hour < 21) periods.evening++;
      else periods.night++;
    });

    return periods;
  };

  // Get check-in and check-out times
  // const getSessionTimes = () => {
  //   const savedState = localStorage.getItem('trackingState');
  //   if (!savedState) return { checkIn: checkInTime, checkOut: checkOutTime };

  //   const formatTime = (date: Date) => {
  //     return date.toLocaleString(undefined, {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true
  //     });
  //   };

  //   return {
  //     checkIn: formatTime(checkInTime),
  //     checkOut: formatTime(checkOutTime)
  //   };
  // };

  // Calculate daily statistics
  const calculateDailyStats = () => {
    if (screenshots.length === 0) return { date: 'No data', count: 0 };

    const today = new Date();
    const todayScreenshots = screenshots.filter(s => {
      const screenshotDate = new Date(s.timestamp);
      return screenshotDate.toDateString() === today.toDateString();
    });

    return {
      date: today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
      count: todayScreenshots.length
    };
  };

  const timeDistribution = calculateTimeDistribution();
  const sessionTimes = { checkIn: checkInTime ? checkInTime : "No data", checkOut: checkOutTime ? checkOutTime : "No data" };
  const dailyStats = calculateDailyStats();

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">Session Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <LogIn className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Check-in Time</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{sessionTimes.checkIn}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <LogOut className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Check-out Time</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{sessionTimes.checkOut}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Timer className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Duration</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{calculateTotalTime()}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Active Time</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{calculateActiveTime()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">Daily Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Today's Date</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{dailyStats.date}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Activity className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Today's Screenshots</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{dailyStats.count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">Time Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Sun className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Morning Activity</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{timeDistribution.morning} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Afternoon Activity</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{timeDistribution.afternoon} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Moon className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Evening Activity</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{timeDistribution.evening} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Night Activity</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{timeDistribution.night} sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;