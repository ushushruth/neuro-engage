import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { History, Download, UploadCloud, ChevronDown, ChevronUp, Activity, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const C_LOAD = '#fca5a5';     
const C_FOCUS = '#ffffff';    
const C_ATTENTION = '#a1a1aa'; 

const monthlyData = [
  { date: 'Mar 1', load: 65, focus: 78, attention: 82 },
  { date: 'Mar 8', load: 59, focus: 85, attention: 88 },
  { date: 'Mar 15', load: 72, focus: 60, attention: 65 },
  { date: 'Mar 22', load: 68, focus: 75, attention: 79 },
  { date: 'Mar 29', load: 64, focus: 82, attention: 86 },
];

const generateSessionWaves = (seed: number) => {
  return Array.from({ length: 40 }, (_, i) => {
    const alpha = Math.abs(Math.sin(i * 0.2 + seed) * 30 + 30 + Math.random() * 10);
    const beta = Math.abs(Math.cos(i * 0.3 + seed) * 40 + 40 + Math.random() * 15);
    const gamma = Math.abs(Math.sin(i * 0.5 + seed) * 20 + 20 + Math.random() * 5);
    const focus = Math.abs(Math.cos(i * 0.1 + seed) * 20 + 60 + Math.random() * 5);
    const attention = Math.abs(Math.sin(i * 0.15 + seed) * 15 + 70 + Math.random() * 5);

    return { time: i, alpha, beta, gamma, focus, attention };
  });
};

const initialSessions = [
  { id: 'SES-092', date: 'Today, 10:00 AM', duration: '45m', avgStress: 'High', avgFocus: '82%', waves: generateSessionWaves(1) },
  { id: 'SES-091', date: 'Yesterday, 2:15 PM', duration: '1h 10m', avgStress: 'Neutral', avgFocus: '91%', waves: generateSessionWaves(2) },
  { id: 'SES-090', date: 'Mar 22, 9:00 AM', duration: '50m', avgStress: 'Elevated', avgFocus: '78%', waves: generateSessionWaves(3) },
  { id: 'SES-089', date: 'Mar 21, 1:30 PM', duration: '35m', avgStress: 'Neutral', avgFocus: '88%', waves: generateSessionWaves(4) },
];

export const Analysis: React.FC = () => {
  const role = localStorage.getItem('neuro_role') || 'manager';
  const isManager = role === 'manager';

  const [sessions, setSessions] = useState(initialSessions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const newSession = {
          id: `SES-0${Math.floor(Math.random() * 100) + 100}`,
          date: 'Just Now',
          duration: 'Imported Data',
          avgStress: Math.random() > 0.5 ? 'Elevated' : 'Neutral',
          avgFocus: `${Math.floor(Math.random() * 20) + 75}%`,
          waves: generateSessionWaves(Math.random() * 10)
        };
        setSessions([newSession, ...sessions]);
        setIsUploading(false);
        setExpandedId(newSession.id);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      <header className="flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1">
             {isManager ? 'Analysis Library' : 'My Session Reports'}
          </h1>
          <p className="text-text-secondary text-sm">Review historical baselines, detailed brainwave patterns, and telemetry records.</p>
        </div>
        <div className="flex gap-2 relative">
          <input 
            type="file" 
            accept=".csv,.edf,.json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${isUploading ? 'opacity-50 cursor-not-allowed bg-border-subtle text-text-muted' : 'bg-white text-black hover:opacity-90'}`}
          >
            <UploadCloud size={16} className={isUploading ? 'animate-bounce' : ''} /> 
            {isUploading ? 'Loading Data...' : 'Import Data'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* Expanded Monthly Baseline Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-col xl:flex-row xl:justify-between xl:items-start py-6 gap-6">
            <div className="flex flex-col gap-2 max-w-sm">
              <CardTitle className="text-sm flex items-center gap-2 text-text-secondary mt-1">
                <History className="text-white" size={14} /> Long-Term Cognitive Baseline
              </CardTitle>
              <p className="font-normal text-text-muted text-xs leading-relaxed mt-1">
                Historical overview tracking physiological vs cognitive vectors over an extended monthly cadence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-text-secondary">
              <div className="flex flex-col gap-1 max-w-[200px]">
                <div className="flex items-center gap-2 font-medium text-white text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C_LOAD }}></div>
                  Cognitive Load (Beta)
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">Tracks mental effort. Elevated levels (&gt;70) suggest burnout risk.</p>
              </div>
              <div className="flex flex-col gap-1 max-w-[200px]">
                <div className="flex items-center gap-2 font-medium text-white text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C_FOCUS }}></div>
                  Focus Score (Alpha)
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">Relaxed alertness and deep concentration leading to flow states.</p>
              </div>
              <div className="flex flex-col gap-1 max-w-[200px]">
                <div className="flex items-center gap-2 font-medium text-white text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C_ATTENTION }}></div>
                  Attention Span (Gamma)
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">Correlates with high-level conceptual binding and rapid sensory tracking.</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="h-80 p-6 pt-0 border-t border-border-subtle mt-2">
            <div className="w-full h-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} domain={[40, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }}
                  />
                  <Area type="monotone" name="Cognitive Load" dataKey="load" stroke={C_LOAD} fillOpacity={0.1} fill={C_LOAD} isAnimationActive={false} strokeWidth={1} />
                  <Area type="monotone" name="Focus" dataKey="focus" stroke={C_FOCUS} fillOpacity={0} isAnimationActive={false} strokeWidth={1} />
                  <Area type="monotone" name="Attention" dataKey="attention" stroke={C_ATTENTION} fillOpacity={0} isAnimationActive={false} strokeWidth={1} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Sessions Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="py-4 border-border-subtle">
            <CardTitle className="text-sm text-text-secondary">Detailed Session Library</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/50">
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">Identifier</th>
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">Recorded</th>
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">Duration</th>
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">State</th>
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">Focus</th>
                  <th className="p-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sessions.map((session) => (
                    <React.Fragment key={session.id}>
                      <tr 
                        className={`border-b border-border-subtle transition-colors cursor-pointer ${expandedId === session.id ? 'bg-border-subtle/50' : 'hover:bg-bg-surface-elevated/50'}`}
                        onClick={() => toggleDetails(session.id)}
                      >
                        <td className="p-4 text-sm font-medium text-white">{session.id}</td>
                        <td className="p-4 text-sm text-text-secondary">{session.date}</td>
                        <td className="p-4 text-sm text-text-secondary">{session.duration}</td>
                        <td className="p-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${
                            session.avgStress === 'High' ? 'text-status-stress border-status-stress/20' :
                            session.avgStress === 'Elevated' ? 'text-status-anxious border-status-anxious/20' :
                            'text-status-calm border-status-calm/20'
                          }`}>
                            {session.avgStress}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-white font-medium">{session.avgFocus}</td>
                        <td className="p-4 text-sm text-text-secondary flex justify-end items-center gap-1">
                          {expandedId === session.id ? 'Hide' : 'Expand'}
                          {expandedId === session.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>

                      {/* Expanded Details Pane */}
                      {expandedId === session.id && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-bg-base border-b border-border-subtle"
                        >
                          <td colSpan={6} className="p-6">
                            <div className="grid grid-cols-1 gap-8 w-full max-w-5xl">
                              
                              <div className="flex flex-col gap-3">
                                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                                  <Activity size={14} className="text-text-muted" />
                                  Raw EEG Signals Detail
                                </h4>
                                <div className="h-64 w-full rounded-md p-1 border border-border-subtle mt-2">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={session.waves} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                      <XAxis dataKey="time" hide />
                                      <YAxis domain={[0, 100]} hide />
                                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }} labelStyle={{ display: 'none' }} />
                                      <Line type="monotone" dataKey="alpha" stroke="#a1a1aa" strokeWidth={1} dot={false} isAnimationActive={false} />
                                      <Line type="monotone" dataKey="beta" stroke="#fca5a5" strokeWidth={1} dot={false} isAnimationActive={false} />
                                      <Line type="monotone" dataKey="gamma" stroke="#52525b" strokeWidth={1} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3">
                                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                                  <Target size={14} className="text-text-muted" />
                                  Aggregated Attention Vectors
                                </h4>
                                <div className="h-64 w-full rounded-md p-1 border border-border-subtle mt-2">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={session.waves} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                      <XAxis dataKey="time" hide />
                                      <YAxis domain={[0, 100]} hide />
                                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }} labelStyle={{ display: 'none' }} />
                                      <Area type="step" dataKey="focus" stroke="#ffffff" fillOpacity={0} isAnimationActive={false} strokeWidth={1} />
                                      <Area type="step" dataKey="attention" stroke="#a1a1aa" fillOpacity={0.1} fill="#a1a1aa" isAnimationActive={false} strokeWidth={1} />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
