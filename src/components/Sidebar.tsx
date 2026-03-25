import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Brain, User, Settings, LogOut, Disc } from 'lucide-react';
import { cn } from './UI';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('neuro_role') || 'manager';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('neuro_role');
    navigate('/');
  };

  const allNavItems = [
    { icon: Disc, label: 'Overview', path: '/dashboard', roles: ['manager', 'subject'] },
    { icon: Activity, label: 'Live Data', path: '/eeg', roles: ['manager', 'subject'] },
    { icon: Brain, label: 'Session Reports', path: '/analysis', roles: ['manager', 'subject'] },
    { icon: User, label: 'Subjects', path: '/students', roles: ['manager'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['manager', 'subject'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 h-screen border-r border-border-subtle bg-bg-base flex flex-col fixed left-0 top-0">
      <div className="p-8 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Brain size={16} className="text-black" />
          </div>
          <h1 className="text-lg font-medium tracking-tight text-white">NeuroEngage</h1>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium ml-9">
          {role === 'manager' ? 'Admin View' : 'Subject View'}
        </span>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {filteredNavItems.map((item) => (
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
        <a 
          href="/"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm rounded-md text-text-secondary hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
};
