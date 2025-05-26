import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, BarChart2, Settings, Clock, Camera } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useAppContext();

  const handleTabChange = (tab: 'dashboard' | 'analytics' | 'settings' | 'screenshots') => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar w-64 bg-slate-800 flex flex-col">
      <div className="logo p-6 flex items-center border-b border-slate-700">
        <Clock size={24} className="text-sky-400 mr-3" />
        <span className="text-xl font-semibold">WorkTracker</span>
      </div>

      <nav className="nav-menu flex-1 p-4">
        <NavItem
          icon={<Home size={20} />}
          text="Dashboard"
          isActive={activeTab === 'dashboard'}
          onClick={() => handleTabChange('dashboard')}
        />
        <NavItem
          icon={<Camera size={20} />}
          text="Screenshots"
          isActive={activeTab === 'screenshots'}
          onClick={() => handleTabChange('screenshots')}
        />
        <NavItem
          icon={<BarChart2 size={20} />}
          text="Analytics"
          isActive={activeTab === 'analytics'}
          onClick={() => handleTabChange('analytics')}
        />
        <NavItem
          icon={<Settings size={20} />}
          text="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => handleTabChange('settings')}
        />
      </nav>

      <div className="sidebar-footer p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">© 2025 WorkTracker</div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, isActive, onClick }) => {
  return (
    <a
      href="#"
      className={`nav-item flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${isActive
        ? 'bg-sky-600 text-white'
        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
        }`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </a>
  );
};

export default Sidebar;