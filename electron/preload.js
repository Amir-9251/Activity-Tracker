import { contextBridge, ipcRenderer } from 'electron';

// Add logging to IPC communication
const logIPC = (action, ...args) => {
  console.log(`[IPC] ${action}:`, ...args);
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    takeScreenshot: () => {
      logIPC('Sending take-screenshot');
      ipcRenderer.send('take-screenshot');
    },
    getScreenshots: () => {
      logIPC('Requesting get-screenshots');
      return ipcRenderer.invoke('get-screenshots');
    },
    startTracking: (interval) => {
      logIPC('Starting tracking with interval:', interval);
      ipcRenderer.send('start-tracking', interval);
    },
    stopTracking: () => {
      logIPC('Stopping tracking');
      ipcRenderer.send('stop-tracking');
    },
    toggleStartup: (enabled) => {
      logIPC('Toggling startup:', enabled);
      ipcRenderer.send('toggle-startup', enabled);
    },
    exportData: () => {
      logIPC('Exporting data');
      ipcRenderer.send('export-data');
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
    onDataExported: (callback) => {
      logIPC('Registering data-exported listener');
      ipcRenderer.on('data-exported', () => {
        logIPC('Received data-exported event');
        callback();
      });
    }
  }
);