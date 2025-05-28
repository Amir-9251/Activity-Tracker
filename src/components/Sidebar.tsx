import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, BarChart2, Settings, Clock, Camera, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleTabChange = (tab: 'dashboard' | 'analytics' | 'settings' | 'screenshots') => {
    setActiveTab(tab);
  };

  return (
    <div className={`sidebar fixed top-0 left-0 h-screen bg-slate-800 flex flex-col transition-all duration-300 z-50
      ${isCollapsed ? 'w-16' : 'w-64'} 
      md:relative md:translate-x-0
      ${isCollapsed ? '-translate-x-0' : 'translate-x-0'}`}
    >
      <div className="logo w-full p-4 flex items-center border-b border-slate-700 justify-between">
        <div className="flex items-center">
          <Clock size={24} className="text-sky-400 mr-3" />
          {!isCollapsed && <span className="text-xl font-semibold whitespace-nowrap">WorkTracker</span>}
        </div>
        <div className="flex-1"></div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!isCollapsed && <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="nav-menu flex-1 p-4 overflow-y-auto">
        <NavItem
          icon={<Home size={20} />}
          text="Dashboard"
          isActive={activeTab === 'dashboard'}
          onClick={() => handleTabChange('dashboard')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Camera size={20} />}
          text="Screenshots"
          isActive={activeTab === 'screenshots'}
          onClick={() => handleTabChange('screenshots')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<BarChart2 size={20} />}
          text="Analytics"
          isActive={activeTab === 'analytics'}
          onClick={() => handleTabChange('analytics')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Settings size={20} />}
          text="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => handleTabChange('settings')}
          isCollapsed={isCollapsed}
        />
        <button
          onClick={() => setIsCollapsed(false)}
          className=" flex items-center px-1.5 mt-4 py-2 mb-2 rounded-lg transition-colors
           text-slate-400 hover:bg-slate-700 hover:text-white"

          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed && <PanelLeftOpen size={20} />}
        </button>
      </nav>

      <div className="sidebar-footer p-4 border-t border-slate-700">
        {!isCollapsed && <div className="text-xs text-slate-500">© 2025 WorkTracker</div>}
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, isActive, onClick, isCollapsed }) => {
  return (
    <button
      className={`nav-item w-full flex items-center px-4 py-2 mb-2 rounded-lg transition-colors
        ${isActive
          ? 'bg-sky-600 text-white'
          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
        } 
        ${isCollapsed ? 'justify-center' : ''}`}
      onClick={onClick}
      title={isCollapsed ? text : ''}
    >
      <span className={isCollapsed ? '' : 'mr-3'}>{icon}</span>
      {!isCollapsed && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
};

export default Sidebar;