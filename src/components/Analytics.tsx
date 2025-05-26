import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Timer, Sun, Moon, TrendingUp, LogIn, LogOut, Calendar, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  const { screenshots } = useAppContext();

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
  const getSessionTimes = () => {
    if (screenshots.length === 0) return { checkIn: 'No data', checkOut: 'No data' };

    const sortedScreenshots = [...screenshots].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const checkIn = new Date(sortedScreenshots[0].timestamp);
    const checkOut = new Date(sortedScreenshots[sortedScreenshots.length - 1].timestamp);

    const formatTime = (date: Date) => {
      return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    return {
      checkIn: formatTime(checkIn),
      checkOut: formatTime(checkOut)
    };
  };

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
  const sessionTimes = getSessionTimes();
  const dailyStats = calculateDailyStats();

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Session Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <LogIn className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Check-in Time</p>
                <p className="text-xl font-semibold">{sessionTimes.checkIn}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <LogOut className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-sm text-gray-400">Check-out Time</p>
                <p className="text-xl font-semibold">{sessionTimes.checkOut}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Timer className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-xl font-semibold">{calculateTotalTime()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Active Time</p>
                <p className="text-xl font-semibold">{calculateActiveTime()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Daily Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Today's Date</p>
                <p className="text-xl font-semibold">{dailyStats.date}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Today's Screenshots</p>
                <p className="text-xl font-semibold">{dailyStats.count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Time Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Sun className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Morning Activity</p>
                <p className="text-xl font-semibold">{timeDistribution.morning} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Afternoon Activity</p>
                <p className="text-xl font-semibold">{timeDistribution.afternoon} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Moon className="w-6 h-6 text-indigo-400" />
              <div>
                <p className="text-sm text-gray-400">Evening Activity</p>
                <p className="text-xl font-semibold">{timeDistribution.evening} sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Night Activity</p>
                <p className="text-xl font-semibold">{timeDistribution.night} sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;