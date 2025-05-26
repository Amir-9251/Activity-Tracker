import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';

// Check if running in Electron
if (!window.electron) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: 'red',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1>This application can only be run as a desktop app</h1>
        <p>Please download and install the desktop version from the official website.</p>
      </div>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
}