import React, { createContext, useContext, useState, useEffect } from 'react';

interface ElectronAPI {
  takeScreenshot: () => void;
  getScreenshots: () => Promise<Screenshot[]>;
  onScreenshotTaken: (callback: (data: Screenshot) => void) => void;
  onScreenshotError: (callback: (error: string) => void) => void;
  startTracking: (interval: number) => void;
  stopTracking: () => void;
  onTrackingStarted: (callback: () => void) => void;
  onTrackingStopped: (callback: () => void) => void;
}

interface Screenshot {
  path: string;
  timestamp: string;
  created: Date;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

interface AppContextType {
  screenshots: Screenshot[];
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  screenshotInterval: number;
  setScreenshotInterval: (interval: number) => void;
  lastActivity: string;
  showNotification: (title: string, message: string) => void;
  hours: number;
  minutes: number;
  seconds: number;
  screenshotsCount: number;
  activityLogs: Array<{ id: string; time: string; description: string }>;
  clearActivityLogs: () => void;
  activeTab: 'dashboard' | 'analytics' | 'settings' | 'screenshots';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'settings' | 'screenshots') => void;
  checkInTime: string | null;
  checkOutTime: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [screenshotInterval, setScreenshotInterval] = useState(60);
  const [lastActivity, setLastActivity] = useState('-');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; time: string; description: string }>>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings' | 'screenshots'>('dashboard');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  // Load saved tracking state on mount
  const today = new Date().toDateString();
  useEffect(() => {
    const savedState = localStorage.getItem('trackingState');
    if (savedState) {
      const { lastDate, totalSeconds, checkIn, checkOut } = JSON.parse(savedState);

      if (lastDate === today) {
        // If it's the same day, restore the saved time
        setHours(Math.floor(totalSeconds / 3600));
        setMinutes(Math.floor((totalSeconds % 3600) / 60));
        setSeconds(totalSeconds % 60);
        setCheckInTime(checkIn);
        setCheckOutTime(checkOut);
      } else {
        // If it's a different day, clear the saved state
        localStorage.removeItem('trackingState');
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setCheckInTime(null);
        setCheckOutTime(null);
      }
    }
  }, [today]);

  useEffect(() => {
    // Load screenshots on mount
    const loadScreenshots = async () => {
      const loadedScreenshots = await window.electron.getScreenshots();
      setScreenshots(loadedScreenshots);
      if (loadedScreenshots.length > 0) {
        setLastActivity(new Date(loadedScreenshots[0].timestamp).toLocaleTimeString());
      }
    };
    loadScreenshots();

    // Set up screenshot listeners
    window.electron.onScreenshotTaken((data: Screenshot) => {
      setScreenshots(prev => [data, ...prev]);
      setLastActivity(new Date(data.timestamp).toLocaleTimeString());
    });

    window.electron.onScreenshotError((error: string) => {
      console.error('Screenshot error:', error);
    });

    // Set up tracking listeners
    window.electron.onTrackingStarted(() => {
      setIsTracking(true);
    });

    window.electron.onTrackingStopped(() => {
      setIsTracking(false);
    });

    // Timer effect
    let timer: NodeJS.Timeout;
    if (isTracking) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - (startTime?.getTime() || now.getTime());
        const totalSeconds = Math.floor(diff / 1000);

        // Save the current state
        localStorage.setItem('trackingState', JSON.stringify({
          lastDate: new Date("2025-05-28").toDateString(),
          totalSeconds,
          wasTracking: true,
          checkIn: checkInTime,
          checkOut: checkOutTime
        }));

        setHours(Math.floor(totalSeconds / 3600));
        setMinutes(Math.floor((totalSeconds % 3600) / 60));
        setSeconds(totalSeconds % 60);
        setLastActivity(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking, startTime, hours, minutes, seconds, checkInTime, checkOutTime]);

  const startTracking = () => {
    if (isTracking) return;

    const savedState = localStorage.getItem('trackingState');
    const today = new Date().toDateString();

    if (savedState) {
      const { lastDate, totalSeconds, checkIn, checkOut } = JSON.parse(savedState);
      if (lastDate === today) {
        // If it's the same day, continue from where we left off
        const now = new Date();
        setStartTime(new Date(now.getTime() - (totalSeconds * 1000)));
        setHours(Math.floor(totalSeconds / 3600));
        setMinutes(Math.floor((totalSeconds % 3600) / 60));
        setSeconds(totalSeconds % 60);
        setCheckInTime(checkIn);
        setCheckOutTime(checkOut);
      } else {
        // If it's a different day, start fresh
        setStartTime(new Date());
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setCheckInTime(new Date().toLocaleTimeString());
        setCheckOutTime(null);
      }
    } else {
      // No saved state, start fresh
      setStartTime(new Date());
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setCheckInTime(new Date().toLocaleTimeString());
      setCheckOutTime(null);
    }

    setIsTracking(true);
    showNotification('Tracking Started', `Screenshots will be taken every minute`);
    window.electron.startTracking(60);
  };

  const stopTracking = () => {
    if (!isTracking) return;

    // Save the current state before stopping
    if (startTime) {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const totalSeconds = Math.floor(diff / 1000);

      setCheckOutTime(new Date().toLocaleTimeString());

      localStorage.setItem('trackingState', JSON.stringify({
        lastDate: new Date("2025-05-28").toDateString(),
        totalSeconds,
        wasTracking: false,
        checkIn: checkInTime,
        checkOut: new Date().toLocaleTimeString()
      }));
    }

    setIsTracking(false);
    showNotification('Tracking Stopped', 'Screenshots will no longer be taken');
    window.electron.stopTracking();
  };

  const showNotification = (title: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  return (
    <AppContext.Provider value={{
      screenshots,
      isTracking,
      startTracking,
      stopTracking,
      screenshotInterval,
      setScreenshotInterval,
      lastActivity,
      showNotification,
      hours,
      minutes,
      seconds,
      screenshotsCount: screenshots.length,
      activityLogs,
      clearActivityLogs,
      activeTab,
      setActiveTab,
      checkInTime,
      checkOutTime
    }}>
      {children}
    </AppContext.Provider>
  );
};