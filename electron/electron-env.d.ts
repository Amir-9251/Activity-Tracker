/// <reference types="electron" />
/// <reference types="vite/client" />

interface Window {
  electron: {
    takeScreenshot: () => void;
    getScreenshots: () => Promise<any[]>;
    startTracking: (interval: number) => void;
    stopTracking: () => void;
    toggleStartup: (enabled: boolean) => void;
    exportData: () => void;
    onScreenshotTaken: (callback: (data: any) => void) => void;
    onScreenshotError: (callback: (error: string) => void) => void;
    onDataExported: (callback: () => void) => void;
  };
}