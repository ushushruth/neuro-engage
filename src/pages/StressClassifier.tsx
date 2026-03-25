import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, Zap, Check, X, Activity, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/* ═══════════════════════════════════════════════════════════════════════════
   EEG Stress Classifier — Dynamic API Integration
   
   Data is loaded dynamically from the Express backend on each request:
     GET  /api/eeg/model-info   → Available models
     GET  /api/eeg/sample       → Fresh EEG epoch with waveforms
     POST /api/eeg/predict      → Classification result
   ═══════════════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://neuro-engage.onrender.com';

const BAND_COLORS: Record<string,string> = {
  delta: '#6366f1', theta: '#8b5cf6', alpha: '#c084fc', beta: '#f472b6', gamma: '#34d399',
};
const BAND_NAMES = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

/* ═══════════════════════════════════════════════════════════════════════════ */
export const StressClassifier: React.FC = () => {
  /* ── State ──────────────────────────────────────────────────────────────── */
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('SVM');
  const [sample, setSample] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [waveformData, setWaveformData] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('Fp1');
  const [error, setError] = useState('');
  const animRef = useRef<number>(0);
  const animIdxRef = useRef(0);

  /* ── Fetch available models on mount ───────────────────────────────────── */
  useEffect(() => {
    fetch(`${API_BASE}/api/eeg/model-info`)
      .then(r => r.json())
      .then(data => {
        if (data.trained_models) setModels(data.trained_models);
      })
      .catch(() => setModels(['SVM', 'Random Forest', 'KNN', 'MLP', 'XGBoost', 'CNN-LSTM']));
  }, []);

  /* ── Animate waveform when sample loaded ───────────────────────────────── */
  const animateWaveform = useCallback(() => {
    if (!sample) return;
    const wave = sample.waveforms?.[selectedChannel];
    if (!wave) return;

    animIdxRef.current += 1;
    const idx = animIdxRef.current;
    if (idx >= wave.length) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    setWaveformData(d => [...d.slice(-80), { t: idx, value: wave[idx] }]);
    animRef.current = requestAnimationFrame(animateWaveform);
  }, [sample, selectedChannel]);

  useEffect(() => {
    if (sample && sample.waveforms?.[selectedChannel]) {
      animIdxRef.current = 0;
      setWaveformData([]);
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animateWaveform);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [sample, selectedChannel, animateWaveform]);

  /* ── Load Sample (dynamic API fetch) ───────────────────────────────────── */
  const handleLoadSample = async () => {
    setIsLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/eeg/sample`);
      if (!res.ok) throw new Error('Failed to load sample');
      const data = await res.json();
      setSample(data);
      if (data.channel_names?.length > 0) setSelectedChannel(data.channel_names[0]);
    } catch (err: any) {
      setError(err.message || 'Server not responding. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Classify (dynamic API fetch) ──────────────────────────────────────── */
  const handleClassify = async () => {
    if (!sample) return;
    setIsClassifying(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/eeg/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sample.subject,
          trial: sample.trial,
          epoch: sample.epoch,
          model: selectedModel,
          true_label: sample.true_label,
        }),
      });
      if (!res.ok) throw new Error('Classification failed');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Classification request failed');
    } finally {
      setIsClassifying(false);
    }
  };

  /* ── Band power bars ───────────────────────────────────────────────────── */
  const bandBars = sample?.band_powers?.[selectedChannel]
    ? (() => {
        const powers: number[] = sample.band_powers[selectedChannel];
        const total = powers.reduce((a: number, b: number) => a + b, 0) + 1e-9;
        return BAND_NAMES.map((name, i) => ({ name, power: powers[i], pct: (powers[i] / total) * 100 }));
      })()
    : [];

  const channelNames: string[] = sample?.channel_names || [];

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24 }}>
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 36, height: 36, borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow:'0 0 15px rgba(99,102,241,0.3)' }}>
            <Brain size={20} color="white" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-white">EEG Stress Classifier</h1>
          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600,
            background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399' }}>
            LIVE API
          </span>
        </div>
        <p className="text-text-secondary text-sm">
          Real-time EEG-based stress detection. Data is loaded dynamically from the server on each request.
        </p>
      </header>

      {/* Controls Row */}
      <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', maxWidth: 280 }}>
          <label style={{ display:'block', fontSize:11, color:'#a1a1aa', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600, marginBottom:8 }}>
            ML Model
          </label>
          <select value={selectedModel}
            onChange={e => { setSelectedModel(e.target.value); setResult(null); }}
            style={{ width:'100%', height:44, borderRadius:10, padding:'0 14px', fontSize:14, color:'#fff',
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', outline:'none',
              fontFamily:'Inter, sans-serif', cursor:'pointer' }}>
            {(models.length > 0 ? models : ['SVM']).map(m => (
              <option key={m} value={m} style={{ background:'#0f0f1a' }}>{m}</option>
            ))}
          </select>
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'flex-end', paddingTop:24 }}>
          <motion.button onClick={handleLoadSample} disabled={isLoading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ height:44, padding:'0 20px', borderRadius:10, fontSize:14, fontWeight:600, border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', gap:8, fontFamily:'Inter, sans-serif',
              background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'#fff',
              boxShadow:'0 2px 12px rgba(99,102,241,0.3)', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Load Sample
          </motion.button>

          <motion.button onClick={handleClassify} disabled={!sample || isClassifying}
            whileHover={{ scale: sample ? 1.02 : 1 }} whileTap={{ scale: sample ? 0.98 : 1 }}
            style={{ height:44, padding:'0 20px', borderRadius:10, fontSize:14, fontWeight:600, border:'none',
              cursor: sample ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', gap:8,
              fontFamily:'Inter, sans-serif',
              background: sample ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
              color: sample ? '#fff' : '#52525b',
              boxShadow: sample ? '0 2px 12px rgba(16,185,129,0.3)' : 'none' }}>
            {isClassifying ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Classify EEG Signal
          </motion.button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, fontSize:14,
            background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', flexShrink:0 }} />
          {error}
        </motion.div>
      )}

      {/* Sample Info Badges */}
      <AnimatePresence>
        {sample && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { label:'SID', val: `#${sample.sid}` },
              { label:'Subject', val: `#${sample.subject}` },
              { label:'Trial', val: sample.trial },
              { label:'Epoch', val: sample.epoch },
              { label:'Features', val: sample.n_total_features },
              { label:'Ground Truth', val: sample.true_label_text, color: sample.true_label === 1 ? '#f87171' : '#34d399' },
            ].map((b, i) => (
              <div key={i} style={{ padding:'8px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.08)', fontSize:13 }}>
                <span style={{ color:'#71717a', marginRight:6 }}>{b.label}:</span>
                <span style={{ color: b.color || '#fff', fontWeight:600 }}>{b.val}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div style={{ display:'grid', gridTemplateColumns: result ? '1fr 340px' : '1fr', gap:20 }}>
        {/* Waveform Monitor */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center" style={{ flexWrap:'wrap', gap:8 }}>
              <CardTitle>
                <Activity size={16} style={{ display:'inline', marginRight:8, verticalAlign:'middle' }} />
                EEG Waveform Monitor
              </CardTitle>
              {channelNames.length > 0 && (
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {channelNames.map(ch => (
                    <button key={ch} onClick={() => setSelectedChannel(ch)}
                      style={{ padding:'4px 8px', borderRadius:6, fontSize:10, fontWeight:700, border:'none', cursor:'pointer',
                        fontFamily:'monospace', transition:'all 0.15s',
                        background: ch === selectedChannel ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                        color: ch === selectedChannel ? '#fff' : '#71717a' }}>
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            {!sample ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#52525b', fontSize:14,
                border:'1px dashed rgba(255,255,255,0.08)', borderRadius:10, flexDirection:'column', gap:8 }}>
                <Play size={24} />
                Click "Load Sample" to fetch a random EEG epoch from the server
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveformData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" tick={false} axisLine={false} />
                  <YAxis tick={{ fill:'#52525b', fontSize:11 }} axisLine={false} tickLine={false} domain={[-1.5, 1.5]} />
                  <Tooltip contentStyle={{ backgroundColor:'#0f0f1a', border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:10, color:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}
                    formatter={(v: any) => [Number(v).toFixed(4), 'μV']} />
                  <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Prediction Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
              <Card style={{ height:'100%' }}>
                <CardHeader><CardTitle>Prediction Result</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ textAlign:'center', padding:'16px 0' }}>
                      <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto 12px',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background: result.prediction === 1
                          ? 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(239,68,68,0.1))'
                          : 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.1))',
                        border: `2px solid ${result.prediction === 1 ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}` }}>
                        <span style={{ fontSize:28 }}>{result.prediction === 1 ? '😰' : '😌'}</span>
                      </div>
                      <h3 style={{ fontSize:22, fontWeight:700, color: result.prediction === 1 ? '#f87171' : '#34d399', margin:0 }}>
                        {result.prediction_text}
                      </h3>
                      <p style={{ fontSize:13, color:'#71717a', margin:'4px 0 0' }}>
                        {result.confidence}% confidence
                      </p>
                    </div>

                    {[
                      { label:'Model', val: result.model },
                      { label:'Test Accuracy', val: result.accuracy },
                      { label:'Ground Truth', val: result.true_label_text, color: result.true_label === 1 ? '#f87171' : '#34d399' },
                    ].map((s, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0',
                        borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <span style={{ fontSize:13, color:'#71717a' }}>{s.label}</span>
                        <span style={{ fontSize:13, fontWeight:600, color: s.color || '#fff' }}>{s.val}</span>
                      </div>
                    ))}

                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 0',
                      borderRadius:10,
                      background: result.correct ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                      border: `1px solid ${result.correct ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}` }}>
                      {result.correct ? <Check size={18} color="#34d399" /> : <X size={18} color="#f87171" />}
                      <span style={{ fontSize:14, fontWeight:600, color: result.correct ? '#34d399' : '#f87171' }}>
                        {result.correct ? 'Prediction Matches Ground Truth!' : 'Prediction Mismatch'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Band Power Analysis */}
      {sample && sample.band_powers?.[selectedChannel] && (
        <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Band Power Spectrum — {selectedChannel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display:'flex', gap:12, alignItems:'flex-end', height:120 }}>
                {bandBars.map((b, i) => (
                  <div key={b.name} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <motion.div
                      initial={{ height:0 }} animate={{ height:`${b.pct * 1.1}%` }}
                      transition={{ delay: i * 0.1, duration:0.5, ease:'easeOut' }}
                      style={{ width:'100%', maxWidth:60, borderRadius:'6px 6px 0 0',
                        background: `linear-gradient(180deg, ${BAND_COLORS[b.name]}, ${BAND_COLORS[b.name]}88)`,
                        minHeight:4 }} />
                    <span style={{ fontSize:11, fontWeight:600, color: BAND_COLORS[b.name] }}>{b.name}</span>
                    <span style={{ fontSize:10, color:'#71717a' }}>{b.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
