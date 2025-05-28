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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">General Settings</h2>

        <div className="settings-grid space-y-6">
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
                className="w-20 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="input-suffix ml-2 text-slate-400">minutes</span>
            </div>
          </SettingItem>

          <SettingItem
            icon={<Bell size={20} className="text-emerald-400" />}
            label="Screenshot Notifications"
          >
            <ToggleSwitch
              id="notifications"
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
            />
          </SettingItem>

          <SettingItem
            icon={<Power size={20} className="text-sky-400" />}
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

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent mb-6">Data Management</h2>

        <div className="settings-grid space-y-6">
          <SettingItem
            icon={<Trash2 size={20} className="text-emerald-400" />}
            label="Clear All Data"
          >
            <button
              onClick={handleClearData}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20"
            >
              Clear Data
            </button>
          </SettingItem>

          <SettingItem
            icon={<Download size={20} className="text-sky-400" />}
            label="Export Data"
          >
            <button
              onClick={handleExportData}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20"
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
  <div className="setting-item flex items-center justify-between bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
    <div className="flex items-center space-x-4">
      {icon}
      <span className="text-slate-300 font-medium">{label}</span>
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
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sky-400 peer-checked:to-emerald-400"></div>
  </label>
);

export default Settings;