import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Bell, Power, Trash2, Download } from 'lucide-react';

const Settings: React.FC = () => {
  const {
    screenshotInterval,
    setScreenshotInterval,
    showNotification
  } = useAppContext();

  const [startupEnabled, setStartupEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 300 && value <= 3600) { // Minimum 5 minutes (300 seconds)
      setScreenshotInterval(value);
      showNotification('Settings Updated', `Screenshot interval changed to ${Math.floor(value / 60)} minutes`);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      showNotification('Data Cleared', 'All data has been cleared');
    }
  };

  const handleExportData = () => {
    showNotification('Data Export', 'Data export functionality would be implemented here');
  };

  const handleStartupToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartupEnabled(e.target.checked);
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-startup', e.target.checked);
    }
    showNotification('Startup Settings', `Launch on startup ${e.target.checked ? 'enabled' : 'disabled'}`);
  };

  const handleNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(e.target.checked);
    if (e.target.checked) {
      Notification.requestPermission();
    }
    showNotification('Notification Settings', `Notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
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
                min="300"
                max="3600"
                step="300"
                className="w-20 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="input-suffix ml-2 text-slate-400">minutes</span>
            </div>
          </SettingItem>

          <SettingItem
            icon={<Bell size={20} className="text-amber-400" />}
            label="Screenshot Notifications"
          >
            <ToggleSwitch
              id="notifications"
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
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
        </div>
      </div>

      <div className="settings-card bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>

        <div className="settings-grid space-y-4">
          <SettingItem
            icon={<Trash2 size={20} className="text-red-400" />}
            label="Clear All Data"
          >
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Clear Data
            </button>
          </SettingItem>

          <SettingItem
            icon={<Download size={20} className="text-blue-400" />}
            label="Export Data"
          >
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Export
            </button>
          </SettingItem>
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

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, children }) => (
  <div className="setting-item flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-slate-300">{label}</span>
    </div>
    {children}
  </div>
);

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

export default Settings;