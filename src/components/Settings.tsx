import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Bell, Power, Moon, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const {
    screenshotInterval,
    setScreenshotInterval,
    notificationsEnabled,
    setNotificationsEnabled,
    darkMode,
    setDarkMode,
    addActivityLog
  } = useAppContext();

  const [startupEnabled, setStartupEnabled] = React.useState(false);

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 30 && value <= 3600) {
      setScreenshotInterval(value);
      addActivityLog(`Screenshot interval changed to ${value} seconds`);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // In a real app, this would clear persistent storage
      localStorage.clear();
      addActivityLog('All data cleared');
      alert('All data has been cleared');
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    addActivityLog('Data exported');
    alert('Data export functionality would be implemented here');
  };

  const handleStartupToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartupEnabled(e.target.checked);

    // In Electron, this would use the app's autoLaunch feature
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-startup', e.target.checked);
    }

    addActivityLog(`Launch on startup ${e.target.checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="settings-content space-y-6">
      <div className="settings-card bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>

        <div className="settings-grid space-y-4">
          <SettingItem
            icon={<Clock size={20} className="text-sky-400" />}
            label="Screenshot Interval"
          >
            <div className="input-group flex items-center">
              <input
                type="number"
                id="interval"
                value={screenshotInterval}
                onChange={handleIntervalChange}
                min="30"
                max="3600"
                className="w-20 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="input-suffix ml-2 text-slate-400">seconds</span>
            </div>
          </SettingItem>

          <SettingItem
            icon={<Bell size={20} className="text-amber-400" />}
            label="Notifications"
          >
            <ToggleSwitch
              id="notifications"
              checked={notificationsEnabled}
              onChange={(e) => {
                setNotificationsEnabled(e.target.checked);
                addActivityLog(`Notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
              }}
            />
          </SettingItem>

          <SettingItem
            icon={<Power size={20} className="text-emerald-400" />}
            label="Launch on Startup"
          >
            <ToggleSwitch
              id="startup"
              checked={startupEnabled}
              onChange={handleStartupToggle}
            />
          </SettingItem>

          <SettingItem
            icon={<Moon size={20} className="text-violet-400" />}
            label="Dark Mode"
          >
            <ToggleSwitch
              id="darkMode"
              checked={darkMode}
              onChange={(e) => {
                setDarkMode(e.target.checked);
                if (e.target.checked) {
                  document.body.classList.remove('light-mode');
                } else {
                  document.body.classList.add('light-mode');
                }
                addActivityLog(`Dark mode ${e.target.checked ? 'enabled' : 'disabled'}`);
              }}
            />
          </SettingItem>
        </div>
      </div>

      <div className="settings-card bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>

        <div className="settings-grid space-y-4">
          <SettingItem
            icon={<Trash2 size={20} className="text-rose-400" />}
            label="Clear All Data"
          >
            <button
              className="btn bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={handleClearData}
            >
              <Trash2 size={18} className="mr-2" />
              Clear
            </button>
          </SettingItem>

          <SettingItem
            icon={<Download size={20} className="text-sky-400" />}
            label="Export Data"
          >
            <button
              className="btn bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={handleExportData}
            >
              <Download size={18} className="mr-2" />
              Export
            </button>
          </SettingItem>
        </div>
      </div>

      <div className="settings-card bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">About</h2>

        <div className="about-content text-slate-400">
          <p className="mb-2">Work Status Tracker v1.0.0</p>
          <p>A tool to track your work time and productivity.</p>
        </div>
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, children }) => {
  return (
    <div className="setting-item flex items-center justify-between">
      <label className="flex items-center text-white">
        <div className="mr-3">{icon}</div>
        {label}
      </label>
      {children}
    </div>
  );
};

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
  return (
    <div
      className="toggle-switch relative inline-block w-12 h-6 cursor-pointer"
      onClick={() => onChange({ target: { checked: !checked } } as React.ChangeEvent<HTMLInputElement>)}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          backgroundColor: checked ? '#0ea5e9' : '#475569'
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
        initial={false}
        animate={{
          x: checked ? 24 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      />
    </div>
  );
};

export default Settings;