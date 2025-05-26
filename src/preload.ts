// Preload script runs in the renderer process
// but has access to Node.js APIs
import { contextBridge, ipcRenderer } from 'electron';

interface ActivityData {
  mouse_clicks: number;
  key_presses: number;
  idle_time: number;
  timestamp: string;
}

interface Screenshot {
  path: string;
  timestamp: string;
}

// Add logging to IPC communication
const logIPC = (action: string, ...args: unknown[]) => {
  console.log(`[IPC] ${action}:`, ...args);
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // IPC methods for handling screenshots
  takeScreenshot: () => {
    logIPC('Sending take-screenshot');
    ipcRenderer.send('take-screenshot');
  },
  getScreenshots: () => {
    logIPC('Requesting get-screenshots');
    return ipcRenderer.invoke('get-screenshots');
  },

  // IPC methods for tracking
  startTracking: (interval: number) => {
    logIPC('Starting tracking with interval:', interval);
    ipcRenderer.send('start-tracking', interval);
  },
  stopTracking: () => {
    logIPC('Stopping tracking');
    ipcRenderer.send('stop-tracking');
  },

  // IPC methods for app settings
  toggleStartup: (enabled: boolean) => {
    logIPC('Toggling startup:', enabled);
    ipcRenderer.send('toggle-startup', enabled);
  },
  exportData: () => {
    logIPC('Exporting data');
    ipcRenderer.send('export-data');
  },

  // IPC event listeners
  onScreenshotTaken: (callback: (data: Screenshot) => void) => {
    logIPC('Registering screenshot-taken listener');
    ipcRenderer.on('screenshot-taken', (_, data) => {
      logIPC('Received screenshot-taken event:', data);
      callback(data);
    });
  },
  onScreenshotError: (callback: (error: string) => void) => {
    logIPC('Registering screenshot-error listener');
    ipcRenderer.on('screenshot-error', (_, error) => {
      logIPC('Received screenshot-error event:', error);
      callback(error);
    });
  },
  onDataExported: (callback: () => void) => {
    logIPC('Registering data-exported listener');
    ipcRenderer.on('data-exported', () => {
      logIPC('Received data-exported event');
      callback();
    });
  },
  onActivityUpdate: (callback: (data: ActivityData) => void) => {
    logIPC('Registering activity-update listener');
    ipcRenderer.on('activity-update', (_, data) => {
      logIPC('Received activity-update event:', data);
      callback(data);
    });
  },
  onActivityError: (callback: (error: string) => void) => {
    logIPC('Registering activity-error listener');
    ipcRenderer.on('activity-error', (_, error) => {
      logIPC('Received activity-error event:', error);
      callback(error);
    });
  }
});