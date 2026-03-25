import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
        <p className="text-text-secondary">High-level summary of all measurements and system status.</p>
      </header>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glass className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary">
                <Users size={24} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">Total Sessions Today</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">124</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card glass className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-status-anxious/10 rounded-lg text-status-anxious">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">Avg Engagement</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">82%</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card glass className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-status-stress/10 rounded-lg text-status-stress">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">High Stress Alerts</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">7</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card glass className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                <Brain size={24} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">Cognitive Focus</p>
                <h3 className="text-2xl font-bold text-status-calm tracking-tight">Optimal</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card glass className="mt-2">
          <CardHeader className="border-border-highlight">
            <CardTitle>Weekly Stress vs. Calm Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(26, 27, 35, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="stress" name="Stress Time (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="calm" name="Calm Time (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
