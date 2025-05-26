import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Screenshots from './components/Screenshots';
import Sidebar from './components/Sidebar';
import { Clock } from 'lucide-react';


const StatusIndicator: React.FC = () => {
  const { isTracking } = useAppContext();

  return (
    <div className="status-indicator flex items-center px-3 py-1 bg-gray-800 rounded-full">
      <span className={`status-dot w-3 h-3 rounded-full mr-2 ${isTracking ? 'bg-green-500' : 'bg-gray-500'}`}></span>
      <span className="status-text text-sm">{isTracking ? 'Active' : 'Inactive'}</span>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab } = useAppContext();


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'screenshots':
        return <Screenshots />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />

      <div className="main-content flex-1 p-6 overflow-y-auto">
        <div className="header flex justify-between items-center mb-6">
          <div className="header-left flex items-center">
            <h1 className="text-2xl font-bold mr-4">WorkTracker</h1>
            <StatusIndicator />
          </div>
          <div className="header-right">
            <div className="date-display bg-gray-800 px-4 py-2 rounded-lg flex items-center">
              <Clock size={18} className="mr-2 text-blue-400" />
              <span id="current-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;