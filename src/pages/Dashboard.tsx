import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const weekData = [
  { day: 'Mon', stress: 45, calm: 55 },
  { day: 'Tue', stress: 52, calm: 48 },
  { day: 'Wed', stress: 38, calm: 62 },
  { day: 'Thu', stress: 65, calm: 35 },
  { day: 'Fri', stress: 48, calm: 52 },
];

export const Dashboard: React.FC = () => {
  const role = localStorage.getItem('neuro_role') || 'manager';
  const isManager = role === 'manager';

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
          {isManager ? 'Global Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-text-secondary">
          {isManager 
            ? 'High-level summary of all subject measurements and system status.' 
            : 'Personal overview of your recent physiological and cognitive metrics.'}
        </p>
      </header>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-bg-surface-elevated rounded border border-border-subtle text-white">
                <Users size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'Total Sessions' : 'My Weekly Sessions'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {isManager ? '124' : '4'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-bg-surface-elevated rounded border border-border-subtle text-white">
                <TrendingUp size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'Avg Engagement' : 'My Focus Score'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {isManager ? '82%' : '88%'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-bg-surface-elevated border border-border-subtle rounded text-status-stress">
                <AlertTriangle size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                  {isManager ? 'High Stress Alerts' : 'My Stress Events'}
                </p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {isManager ? '7' : '1'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-bg-surface-elevated rounded border border-border-subtle text-white">
                <Brain size={20} />
              </div>
              <div className="flex flex-col">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Current State</p>
                <h3 className={`text-2xl font-medium tracking-tight ${isManager ? 'text-status-calm' : 'text-white'}`}>
                  {isManager ? 'Optimal' : 'Neutral'}
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
              <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px', color: '#fff' }}
                />
                <Bar dataKey="stress" name="Load Vector" fill="#52525b" radius={[2, 2, 0, 0]} barSize={30} />
                <Bar dataKey="calm" name="Focus Vector" fill="#ffffff" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
