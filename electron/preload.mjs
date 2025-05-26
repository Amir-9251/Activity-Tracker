import { contextBridge, ipcRenderer } from 'electron';

// Log IPC communication for debugging
const logIPC = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[IPC]', ...args);
  }
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // IPC methods for screenshots
    takeScreenshot: () => {
      logIPC('Taking screenshot');
      ipcRenderer.send('take-screenshot');
    },
    onScreenshotTaken: (callback) => {
      logIPC('Registering screenshot-taken listener');
      ipcRenderer.on('screenshot-taken', (_, data) => {
        logIPC('Received screenshot-taken event:', data);
        callback(data);
      });
    },
    onScreenshotError: (callback) => {
      logIPC('Registering screenshot-error listener');
      ipcRenderer.on('screenshot-error', (_, error) => {
        logIPC('Received screenshot-error event:', error);
        callback(error);
      });
    },
    getScreenshots: () => {
      logIPC('Getting screenshots');
      return ipcRenderer.invoke('get-screenshots');
    },

    // IPC methods for tracking
    startTracking: (interval) => {
      logIPC('Starting tracking with interval:', interval);
      ipcRenderer.send('start-tracking', interval);
    },
    stopTracking: () => {
      logIPC('Stopping tracking');
      ipcRenderer.send('stop-tracking');
    },
    onTrackingStarted: (callback) => {
      logIPC('Registering tracking-started listener');
      ipcRenderer.on('tracking-started', () => {
        logIPC('Received tracking-started event');
        callback();
      });
    },
    onTrackingStopped: (callback) => {
      logIPC('Registering tracking-stopped listener');
      ipcRenderer.on('tracking-stopped', () => {
        logIPC('Received tracking-stopped event');
        callback();
      });
    }
  }
);