import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

// Minimal distinct colors
const C_ALPHA = '#a1a1aa'; // Zinc 400
const C_BETA = '#fca5a5';  // Red 300 (Subdued Stress)
const C_GAMMA = '#93c5fd'; // Blue 300
const C_FOCUS = '#ffffff'; // White
const C_ATTENTION = '#52525b'; // Zinc 600

const generateMockData = (points = 30) => {
  return Array.from({ length: points }, (_, i) => {
    const baseAlpha = Math.random() * 40 + 20;
    const baseBeta = Math.random() * 50 + 30;
    const baseGamma = Math.random() * 30 + 10;
    const focusLevel = Math.min(100, Math.max(0, (baseAlpha * 1.5) - (baseBeta * 0.5) + 40));
    const attentionLevel = Math.min(100, Math.max(0, baseGamma * 1.2 + 20));

    return { time: i, alpha: baseAlpha, beta: baseBeta, gamma: baseGamma, focus: focusLevel, attention: attentionLevel };
  });
};

const initialData = generateMockData(30);

export const LiveEEG: React.FC = () => {
  const [eegData, setEegData] = useState(initialData);

  // Track cumulative session averages so the top metrics are stable
  const statsRef = useRef({
    totalFocus: initialData.reduce((acc, curr) => acc + curr.focus, 0),
    totalBeta: initialData.reduce((acc, curr) => acc + curr.beta, 0),
    count: 30
  });

  const [sessionAvgFocus, setSessionAvgFocus] = useState(statsRef.current.totalFocus / 30);
  const [sessionAvgBeta, setSessionAvgBeta] = useState(statsRef.current.totalBeta / 30);

  useEffect(() => {
    const interval = setInterval(() => {
      setEegData(current => {
        const newData = [...current.slice(1)];
        const lastTime = newData[newData.length - 1].time;
        const alpha = Math.random() * 40 + 20;
        const beta = Math.random() * 50 + 30;
        const gamma = Math.random() * 30 + 10;
        const focus = Math.min(100, Math.max(0, (alpha * 1.5) - (beta * 0.5) + 40));
        const attention = Math.min(100, Math.max(0, gamma * 1.2 + 20));
        
        // Update cumulative averages
        statsRef.current.totalFocus += focus;
        statsRef.current.totalBeta += beta;
        statsRef.current.count += 1;
        setSessionAvgFocus(statsRef.current.totalFocus / statsRef.current.count);
        setSessionAvgBeta(statsRef.current.totalBeta / statsRef.current.count);

        newData.push({ time: lastTime + 1, alpha, beta, gamma, focus, attention });
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      <header className="flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1">Live Interface</h1>
          <p className="text-text-secondary text-sm">Real-time metrics and brainwave sensor telemetry.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-calm animate-pulse"></span>
          <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Sensors Active</span>
        </div>
      </header>

      {/* Top Metrics Row - Now utilizing cumulative session averages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Avg Session Load</p>
            <h3 className="text-2xl font-medium text-white tracking-tight">{(sessionAvgBeta).toFixed(1)} <span className="text-sm text-text-muted">Hz</span></h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Overall Stress State</p>
            <h3 className={`text-2xl font-medium tracking-tight ${sessionAvgBeta > 70 ? 'text-status-stress' : 'text-white'}`}>
              {sessionAvgBeta > 70 ? 'High' : sessionAvgBeta > 55 ? 'Elevated' : 'Neutral'}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Overall Emotion</p>
            <h3 className="text-2xl font-medium text-white tracking-tight">
              {sessionAvgBeta > 70 ? 'Anxious' : sessionAvgBeta > 55 ? 'Focused' : 'Calm'}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Cumulative Focus</p>
            <h3 className="text-2xl font-medium text-white tracking-tight">{(sessionAvgFocus).toFixed(0)} <span className="text-sm text-text-muted">%</span></h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-center py-4">
              <CardTitle className="text-sm flex items-center gap-2 text-text-secondary">
                <Activity size={14} /> Telemetry
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                 Alpha <div className="w-2 h-2 rounded-full" style={{backgroundColor: C_ALPHA}}></div>
                 Beta <div className="w-2 h-2 rounded-full" style={{backgroundColor: C_BETA}}></div>
                 Gamma <div className="w-2 h-2 rounded-full" style={{backgroundColor: C_GAMMA}}></div>
              </div>
            </CardHeader>
            <CardContent className="h-64 p-4 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eegData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }} labelStyle={{ display: 'none' }} />
                  <Line type="monotone" dataKey="alpha" stroke={C_ALPHA} strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="beta" stroke={C_BETA} strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gamma" stroke={C_GAMMA} strokeWidth={1} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="w-full">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-center py-4">
              <CardTitle className="text-sm flex items-center gap-2 text-text-secondary">
                <Target size={14} /> Attention Vectors
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                 Focus <div className="w-2 h-2 rounded-full" style={{backgroundColor: C_FOCUS}}></div>
                 Attention <div className="w-2 h-2 rounded-full" style={{backgroundColor: C_ATTENTION}}></div>
              </div>
            </CardHeader>
            <CardContent className="h-64 p-4 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eegData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '4px' }} labelStyle={{ display: 'none' }} />
                  <Area type="step" dataKey="focus" stroke={C_FOCUS} fillOpacity={0} isAnimationActive={false} strokeWidth={1} />
                  <Area type="step" dataKey="attention" stroke={C_ATTENTION} fillOpacity={0.1} fill={C_ATTENTION} isAnimationActive={false} strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
