import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/UI';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target, Brain, Radio, CheckCircle2, Play, ArrowRight, BatteryMedium } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Minimal distinct colors
const C_ALPHA = '#a1a1aa'; 
const C_BETA = '#fca5a5';  
const C_GAMMA = '#93c5fd'; 
const C_FOCUS = '#ffffff'; 
const C_ATTENTION = '#52525b'; 

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

type SessionState = 'IDLE' | 'QUESTIONNAIRE' | 'HARDWARE_CHECK' | 'ACTIVE';

export const LiveEEG: React.FC = () => {
  const [sessionState, setSessionState] = useState<SessionState>('IDLE');
  
  // Hardware Check Status
  const [hwStatus, setHwStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  
  // Questionnaire State
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // EEG Data State (Only active in ACTIVE state)
  const initialData = generateMockData(30);
  const [eegData, setEegData] = useState(initialData);

  const statsRef = useRef({
    totalFocus: initialData.reduce((acc, curr) => acc + curr.focus, 0),
    totalBeta: initialData.reduce((acc, curr) => acc + curr.beta, 0),
    count: 30
  });

  const [sessionAvgFocus, setSessionAvgFocus] = useState(statsRef.current.totalFocus / 30);
  const [sessionAvgBeta, setSessionAvgBeta] = useState(statsRef.current.totalBeta / 30);

  // Hardware Check Simulation - Triggered only after manual confirmation
  useEffect(() => {
    if (hwStatus === 'connecting') {
      const t1 = setTimeout(() => setHwStatus('connected'), 2500);
      return () => clearTimeout(t1);
    }
  }, [hwStatus]);

  // Live EEG Streaming Simulation
  useEffect(() => {
    if (sessionState !== 'ACTIVE') return;

    const interval = setInterval(() => {
      setEegData(current => {
        const newData = [...current.slice(1)];
        const lastTime = newData[newData.length - 1].time;
        const alpha = Math.random() * 40 + 20;
        const beta = Math.random() * 50 + 30;
        const gamma = Math.random() * 30 + 10;
        const focus = Math.min(100, Math.max(0, (alpha * 1.5) - (beta * 0.5) + 40));
        const attention = Math.min(100, Math.max(0, gamma * 1.2 + 20));
        
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
  }, [sessionState]);

  const handleAnswer = (question: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const isQuestionnaireComplete = Object.keys(answers).length === 3;

  // --- Render Helpers ---

  if (sessionState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-fade-in text-center px-4">
        <div className="w-20 h-20 rounded-full bg-bg-surface-elevated border border-border-subtle flex items-center justify-center mb-8 shadow-xl">
          <Activity size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Start New Session</h1>
        <p className="text-text-secondary max-w-md mx-auto mb-10 leading-relaxed">
          Initialize a new live sensor telemetry session. You will be guided through a baseline pre-assessment and hardware calibration.
        </p>
        <Button onClick={() => setSessionState('QUESTIONNAIRE')} className="h-12 px-8 text-base transition-all duration-300 hover:scale-[1.03]" style={{ backgroundColor: '#ffffff', color: '#000000', boxShadow: '0 0 25px rgba(255,255,255,0.25)' }}>
          <Play size={18} className="mr-3" /> Initialize Session
        </Button>
      </div>
    );
  }

  const activeStyle = {
    backgroundColor: '#86efac', 
    borderColor: '#86efac',
    color: '#000000',
    boxShadow: '0 0 15px rgba(134,239,172,0.3)',
    fontWeight: 600
  };

  if (sessionState === 'QUESTIONNAIRE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-fade-in px-4">
        <div className="w-full max-w-xl">
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-medium tracking-tight text-white mb-2">Pre-Session Context</h2>
            <p className="text-text-secondary text-sm">Answer these quick questions to help establish a baseline interpretation for your neural data.</p>
          </header>

          <Card className="p-8">
            <div className="flex flex-col gap-8">
              {/* Question 1 */}
              <div>
                <p className="text-white font-medium mb-3">1. How many hours of sleep did you get last night?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['< 5 hours', '5-7 hours', '8+ hours'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer('sleep', opt)}
                      className={`py-2 px-3 border rounded text-sm transition-all ${answers['sleep'] !== opt ? 'border-border-subtle text-text-secondary hover:border-border-highlight' : ''}`}
                      style={answers['sleep'] === opt ? activeStyle : {}}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <p className="text-white font-medium mb-3">2. What is your current perceived stress level?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Low / Relaxed', 'Moderate', 'High / Anxious'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer('stress', opt)}
                      className={`py-2 px-3 border rounded text-sm transition-all ${answers['stress'] !== opt ? 'border-border-subtle text-text-secondary hover:border-border-highlight' : ''}`}
                      style={answers['stress'] === opt ? activeStyle : {}}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <p className="text-white font-medium mb-3">3. Have you consumed caffeine in the last 2 hours?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer('caffeine', opt)}
                      className={`py-2 px-3 border rounded text-sm transition-all ${answers['caffeine'] !== opt ? 'border-border-subtle text-text-secondary hover:border-border-highlight' : ''}`}
                      style={answers['caffeine'] === opt ? activeStyle : {}}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border-subtle flex justify-end">
                <Button 
                  disabled={!isQuestionnaireComplete} 
                  onClick={() => setSessionState('HARDWARE_CHECK')}
                  className="px-6 h-10 transition-all duration-300 hover:scale-[1.03]"
                  style={{ 
                    backgroundColor: isQuestionnaireComplete ? '#ffffff' : '#27272a', 
                    color: isQuestionnaireComplete ? '#000000' : '#a1a1aa', 
                    boxShadow: isQuestionnaireComplete ? '0 0 25px rgba(255,255,255,0.25)' : 'none',
                    border: 'none'
                  }}
                >
                  Proceed to Hardware Setup <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sessionState === 'HARDWARE_CHECK') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-fade-in text-center px-4">
        <h2 className="text-3xl font-medium tracking-tight text-white mb-2">Hardware Calibration</h2>
        <p className="text-text-secondary mb-12 max-w-md">
          Please equip your NeuroEngage EEG headset and securely place the frontal nodes against your forehead.
        </p>

        {/* Custom CSS Animation mapping an EEG headset connection */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Outer rotating dash ring */}
          <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-1000 ${
            hwStatus === 'connected' ? 'border-status-calm' : 'border-border-highlight animate-[spin_6s_linear_infinite]'
          }`}></div>
          
          {/* Inner pulsing solid ring */}
          <div className={`absolute inset-6 rounded-full border transition-all duration-1000 ${
            hwStatus === 'waiting' ? 'border-border-subtle' :
            hwStatus === 'connecting' ? 'border-brand-secondary/50 animate-pulse' :
            'border-status-calm shadow-[0_0_30px_rgba(134,239,172,0.15)] bg-status-calm/5'
          }`}></div>

          <Brain size={48} className={`transition-colors duration-700 relative z-10 ${
            hwStatus === 'connected' ? 'text-status-calm' : 'text-text-muted'
          }`} />

          {hwStatus === 'connected' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-10 right-10 bg-bg-base rounded-full">
              <CheckCircle2 size={32} className="text-status-calm" />
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 min-h-[100px]">
          <div className="flex items-center gap-3 text-sm h-6">
            {hwStatus === 'waiting' && <span className="text-text-secondary">Waiting for confirmation...</span>}
            {hwStatus === 'connecting' && <><Radio size={16} className="text-brand-secondary animate-pulse" /> <span className="text-white">Connecting to EEG Headset...</span></>}
            {hwStatus === 'connected' && <><BatteryMedium size={16} className="text-status-calm" /> <span className="text-status-calm font-medium">EEG Headset Synced & Calibrated (94%)</span></>}
          </div>

          <AnimatePresence mode="wait">
            {hwStatus === 'waiting' && (
              <motion.div key="equip-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button onClick={() => setHwStatus('connecting')} className="h-10 px-6 transition-all duration-300 hover:scale-[1.03]" style={{ backgroundColor: '#ffffff', color: '#000000', boxShadow: '0 0 25px rgba(255,255,255,0.25)', border: 'none' }}>
                  <CheckCircle2 size={16} className="mr-2" /> I have equipped my EEG Headset
                </Button>
              </motion.div>
            )}
            {hwStatus === 'connected' && (
              <motion.div key="start-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Button onClick={() => setSessionState('ACTIVE')} className="h-10 px-8 text-base transition-all duration-300 hover:scale-[1.03]" style={{ backgroundColor: '#86efac', color: '#000000', boxShadow: '0 0 30px rgba(134,239,172,0.4)', border: 'none', fontWeight: 600 }}>
                  Start Recording <Play size={16} className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ACTIVE Session View
  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      <header className="flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1">Live Interface</h1>
          <p className="text-text-secondary text-sm">Real-time metrics and brainwave sensor telemetry.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="h-8 py-0 text-xs px-3 transition-opacity hover:opacity-80" style={{ backgroundColor: 'transparent', color: '#fca5a5', border: '1px solid rgba(252,165,165,0.4)', boxShadow: '0 0 15px rgba(252,165,165,0.1)' }} onClick={() => {
            setSessionState('IDLE');
            setHwStatus('waiting');
            setAnswers({});
          }}>Stop Session</Button>
          <div className="flex items-center gap-2 bg-status-calm/10 px-3 py-1.5 rounded border border-status-calm/20">
            <span className="w-2 h-2 rounded-full bg-status-calm animate-pulse"></span>
            <span className="text-status-calm text-xs font-medium uppercase tracking-wider">Sensors Active</span>
          </div>
        </div>
      </header>

      {/* Top Metrics Row */}
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
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }} labelStyle={{ display: 'none' }} />
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
