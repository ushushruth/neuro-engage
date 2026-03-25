import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Brain, User, Settings, LogOut, Disc } from 'lucide-react';
import { cn } from './UI';

const navItems = [
  { icon: Disc, label: 'Overview', path: '/dashboard' },
  { icon: Activity, label: 'Live Data', path: '/eeg' },
  { icon: Brain, label: 'Analysis', path: '/analysis' },
  { icon: User, label: 'Subjects', path: '/students' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen border-r border-border-subtle bg-bg-base flex flex-col fixed left-0 top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
          <Brain size={16} className="text-black" />
        </div>
        <h1 className="text-lg font-medium tracking-tight text-white">NeuroEngage</h1>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm",
                isActive 
                  ? "bg-bg-surface-elevated text-white font-medium" 
                  : "text-text-secondary hover:text-white hover:bg-bg-surface-elevated"
              )
            }
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <NavLink 
          to="/"
          className="flex items-center gap-3 px-4 py-2 text-sm rounded-md text-text-secondary hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Exit</span>
        </NavLink>
      </div>
    </aside>
  );
};
