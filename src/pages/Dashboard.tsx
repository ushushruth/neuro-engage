import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Copy, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const role = localStorage.getItem('neuro_role') || 'manager';
  const isManager = role === 'manager';
  const pairingCode = localStorage.getItem('neuro_pairing_code');
  const userId = localStorage.getItem('neuro_user');

  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const url = isManager ? `http://localhost:5001/api/sessions?managerCode=${pairingCode}` : `http://localhost:5001/api/sessions?userId=${userId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(err => console.error('Dashboard fetch error:', err));
  }, [isManager, pairingCode, userId]);

  const totalSessions = sessions.length;
  const highStressCount = sessions.filter(s => s.avgStress === 'High').length;
  const avgFocusScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + parseInt(s.avgFocus || '0'), 0) / totalSessions) 
    : 0;

  const chartData = sessions.slice(0, 7).reverse().map(s => {
    const d = new Date(s.date);
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const focus = parseInt(s.avgFocus || '0');
    const stress = s.avgStress === 'High' ? 80 : s.avgStress === 'Elevated' ? 50 : 20;
    return { day, stress, calm: focus };
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <header className="flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1">Command Center</h1>
          <p className="text-text-secondary text-sm">Real-time aggregate diagnostics and system status.</p>
        </div>

        {isManager && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-text-muted font-medium tracking-wider">Your Pairing Code</span>
              <span className="text-sm font-semibold text-white tracking-widest">{pairingCode || 'LOADING'}</span>
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }}></div>
            <button onClick={() => navigator.clipboard.writeText(pairingCode || '')} className="text-text-secondary hover:text-white transition-colors" title="Copy Code">
              <Copy size={16} />
            </button>
          </div>
        )}
      </header>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                <Users size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'Total Sessions' : 'My Weekly Sessions'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {totalSessions}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                <TrendingUp size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'Avg Engagement' : 'My Focus Score'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {avgFocusScore}%
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div style={{ padding: 12, background: 'rgba(252,165,165,0.08)', borderRadius: 10, border: '1px solid rgba(252,165,165,0.15)', color: '#fca5a5' }}>
                <AlertTriangle size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'High Stress Alerts' : 'My Stress Events'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {highStressCount}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.05))', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)', color: '#34d399' }}>
                <Activity size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Current State</p>
                <h3 className={`text-2xl font-medium tracking-tight ${totalSessions === 0 ? 'text-text-muted' : (isManager ? 'text-status-calm' : 'text-white')}`}>
                  {totalSessions === 0 ? 'No Data' : 'Active'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="mt-2">
          <CardHeader className="border-border-subtle">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {isManager ? 'Weekly Aggregated Stress vs. Calm Timeline' : 'My Personal Weekly Focus Timeline'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6 border-t border-border-subtle">
            <ResponsiveContainer width="100%" height="100%">
              {chartData.length > 0 ? (
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  />
                  <Bar dataKey="stress" name="Load Vector" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="calm" name="Focus Vector" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted text-sm border border-dashed border-border-subtle rounded-md">
                  No session telemetry available yet. Subjects must complete a live recording.
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
