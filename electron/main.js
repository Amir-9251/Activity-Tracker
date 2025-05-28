import { app, BrowserWindow, ipcMain, dialog, session, protocol } from 'electron';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import electronReloader from 'electron-reloader';

const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register custom protocol for handling local files
app.whenReady().then(() => {
    protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.substr(6);
        const filePath = path.join(__dirname, '..', url);
        callback({ path: filePath });
    });
});

// Enable hot reloading in development
if (isDev) {
    try {
        electronReloader(import.meta.url, {
            debug: true,
            watchRenderer: true
        });
    } catch (_) { console.log('Error loading electron-reloader'); }
}

// Handle Linux-specific graphics issues
if (process.platform === 'linux') {
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-software-rasterizer');
    app.commandLine.appendSwitch('disable-gpu-compositing');
    app.commandLine.appendSwitch('disable-gpu-rasterization');
    app.commandLine.appendSwitch('disable-gpu-sandbox');
    app.commandLine.appendSwitch('disable-gpu-driver-bug-workarounds');
    app.commandLine.appendSwitch('ignore-gpu-blacklist');
    app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
}

let mainWindow;
let screenshotInterval;

// Handle SSL/HTTPS
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Only allow certificates for localhost
    if (url.startsWith('https://localhost') || url.startsWith('https://127.0.0.1')) {
        event.preventDefault();
        callback(true);
    } else {
        callback(false);
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            enableHardwareAcceleration: false,
            sandbox: false
        },
        icon: path.join(__dirname, '../public/icon.png'),
        backgroundColor: '#1a1a1a'
    });

    // Configure session
    session.defaultSession.setCertificateVerifyProc((request, callback) => {
        const { hostname } = request;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            callback(0); // Verification success
        } else {
            callback(-2); // Verification failure
        }
    });

    // Load the React app
    const startUrl = `file://${path.join(__dirname, '../dist/index.html')}`;


    mainWindow.loadURL(startUrl);

    // Open DevTools in development mode
    // if (isDev) {
    //     mainWindow.webContents.openDevTools();
    // }

    // Handle window state
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Screenshot handling using Python script
function takeScreenshot() {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const screenshotDir = path.join(__dirname, '../assets/screenshots');
    const currentDir = path.join(__dirname, '..'); // Project root directory

    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const imagePath = path.join(screenshotDir, `screenshot_${timestamp}.png`);

    // Use Python script to take screenshot
    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: path.join(__dirname, '../python'),
        args: [imagePath]
    };

    PythonShell.run('screenshot.py', options).then(messages => {
        try {
            const result = JSON.parse(messages[0]);
            if (result.success) {
                // Verify the file exists
                if (!fs.existsSync(result.path)) {
                    throw new Error('Screenshot file was not created');
                }

                // Convert absolute path to relative path
                const relativePath = path.relative(currentDir, result.path);

                // Log the screenshot details
                console.log('Screenshot saved:', {
                    path: relativePath,
                    timestamp: result.timestamp
                });

                mainWindow.webContents.send('screenshot-taken', {
                    path: relativePath,
                    timestamp: result.timestamp
                });
            } else {
                console.error('Screenshot failed:', result.error);
                mainWindow.webContents.send('screenshot-error', result.error);
            }
        } catch (error) {
            console.error('Screenshot error:', error.message);
            mainWindow.webContents.send('screenshot-error', error.message);
        }
    }).catch(error => {
        console.error('Screenshot error:', error.message);
        mainWindow.webContents.send('screenshot-error', error.message);
    });
}

// IPC handler for taking screenshots
ipcMain.on('take-screenshot', () => {
    takeScreenshot();
});

// Handle tracking start/stop
ipcMain.on('start-tracking', (_, interval) => {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
    }

    // Convert seconds to milliseconds
    const intervalMs = interval * 1000;
    screenshotInterval = setInterval(() => {
        takeScreenshot();
    }, intervalMs);

    mainWindow.webContents.send('tracking-started');
});

ipcMain.on('stop-tracking', () => {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }
    mainWindow.webContents.send('tracking-stopped');
});

// Handle get-screenshots request
ipcMain.handle('get-screenshots', async () => {
    try {
        const screenshotDir = path.join(__dirname, '../assets/screenshots');
        const currentDir = path.join(__dirname, '..'); // Project root directory

        // Create directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
            return [];
        }

        // Read directory and filter for screenshot files
        const files = await fs.promises.readdir(screenshotDir);
        const screenshots = files
            .filter(file => file.startsWith('screenshot_') && file.endsWith('.png'))
            .map(file => {
                const filePath = path.join(screenshotDir, file);
                const stats = fs.statSync(filePath);
                const relativePath = path.relative(currentDir, filePath);
                return {
                    path: relativePath,
                    timestamp: stats.mtime.toISOString(),
                    created: stats.birthtime
                };
            })
            .sort((a, b) => b.created - a.created); // Sort by creation time, newest first

        return screenshots;
    } catch (error) {
        return [];
    }
});

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});