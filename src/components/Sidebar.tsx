import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Brain, User, Settings, LogOut, Disc, Zap } from 'lucide-react';
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
    { icon: Zap, label: 'Stress Classifier', path: '/stress-classifier', roles: ['manager', 'subject'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['manager', 'subject'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <aside style={{ width: 256, height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #0a0a14 0%, #0f0f1a 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="p-8 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
            <Brain size={16} color="white" />
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
                  ? "text-white font-medium" 
                  : "text-text-secondary hover:text-white"
              )
            }
            style={({ isActive }: any) => isActive ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)' } : { border: '1px solid transparent' }}
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
