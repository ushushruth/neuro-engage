import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Loader2, Shield, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Inline CSS for responsive layout (no Tailwind dependency) ── */
const pageStyles = `
  .login-root {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    background: #050508;
  }
  .login-left {
    display: none;
    width: 48%;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    padding: 48px;
    background: linear-gradient(160deg, #0f0f1a 0%, #0a0a12 40%, #12121f 100%);
  }
  .login-right {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    position: relative;
    background: linear-gradient(180deg, #08080f 0%, #0a0a14 100%);
  }
  .mobile-brand { display: block; text-align: center; margin-bottom: 32px; }
  @media (min-width: 1024px) {
    .login-left { display: flex; }
    .login-right { width: 52%; }
    .mobile-brand { display: none; }
  }
  .login-input {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    padding: 0 16px;
    font-size: 14px;
    color: #ffffff;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    outline: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .login-input::placeholder { color: #52525b; }
  .login-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .login-label {
    display: block;
    font-size: 11px;
    color: #a1a1aa;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    margin-bottom: 8px;
    margin-left: 2px;
  }
  .login-card {
    border-radius: 16px;
    padding: 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
  }
  .login-btn-primary {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-btn-primary:hover {
    box-shadow: 0 6px 30px rgba(99,102,241,0.5);
    transform: translateY(-1px);
  }
  .login-btn-primary:active { transform: translateY(0); }
  .login-btn-secondary {
    width: 100%;
    height: 44px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #a1a1aa;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .login-btn-secondary:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .role-btn {
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .role-btn-active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(99,102,241,0.3);
  }
  .role-btn-inactive { background: transparent; color: #71717a; }
  .role-btn-inactive:hover { color: #fff; }
  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
  }
`;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [managerCode, setManagerCode] = useState('');
  const [role, setRole] = useState<'subject'|'manager'>('subject');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setError('All fields required');
    setLoading(true);
    setError('');

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering 
      ? { username, password, role, managerCode: role === 'subject' ? managerCode : undefined } 
      : { username, password };

    try {
      const res = await fetch(`https://neuro-engage.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('neuro_user', data.userId);
      localStorage.setItem('neuro_username', data.username);
      localStorage.setItem('neuro_role', data.role);
      localStorage.setItem('neuro_pairing_code', data.pairingCode || '');
      localStorage.setItem('neuro_manager_code', data.managerCode || '');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="login-root">

        {/* ═══ LEFT PANEL ═══ */}
        <div className="login-left">
          {/* Animated ambient orbs */}
          <motion.div className="glow-orb"
            style={{ width: 400, height: 400, top: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)' }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="glow-orb"
            style={{ width: 300, height: 300, bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent)' }}
            animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div className="glow-orb"
            style={{ width: 200, height: 200, top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Logo */}
          <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 10 }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              <BrainCircuit size={22} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>NeuroEngage</span>
          </motion.div>

          {/* Hero text */}
          <motion.div style={{ position: 'relative', zIndex: 10, maxWidth: 440 }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }}>
              Cognitive Intelligence,{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Reimagined
              </span>
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.6, marginTop: 16 }}>
              Real-time biometric telemetry and neural state analysis for clinical diagnostics.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
              <span className="badge-pill" style={{ color: '#10b981' }}><Shield size={14} /> HIPAA Compliant</span>
              <span className="badge-pill" style={{ color: '#6366f1' }}><Zap size={14} /> Real-time</span>
              <span className="badge-pill" style={{ color: '#8b5cf6' }}><Activity size={14} /> EEG Monitoring</span>
            </div>
          </motion.div>

          {/* Footer */}
          <p style={{ color: '#4b5563', fontSize: 13, position: 'relative', zIndex: 10 }}>© 2026 NeuroEngage Labs</p>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="login-right">
          {/* Subtle ambient glow */}
          <div className="glow-orb" style={{ width: 350, height: 350, top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent)' }} />

          <motion.div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Mobile-only brand header */}
            <div className="mobile-brand">
              <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 25px rgba(99,102,241,0.3)', margin: '0 auto 16px' }}>
                <BrainCircuit size={28} color="white" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>NeuroEngage</h2>
            </div>

            {/* Form Card */}
            <div className="login-card">
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
                  {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                  {isRegistering ? 'Register to access your diagnostic workspace.' : 'Sign in to your telemetry dashboard.'}
                </p>
              </div>

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="login-label">Username</label>
                  <input className="login-input" type="text" placeholder="Enter your username"
                    value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
                </div>

                <div>
                  <label className="login-label">Password</label>
                  <input className="login-input" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
                </div>

                {isRegistering && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <label className="login-label">Account Type</label>
                    <div style={{ display: 'flex', gap: 8, padding: 5, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <button type="button" onClick={() => setRole('subject')} disabled={loading}
                        className={`role-btn ${role === 'subject' ? 'role-btn-active' : 'role-btn-inactive'}`}>Subject</button>
                      <button type="button" onClick={() => { setRole('manager'); setManagerCode(''); }} disabled={loading}
                        className={`role-btn ${role === 'manager' ? 'role-btn-active' : 'role-btn-inactive'}`}>Manager</button>
                    </div>
                  </motion.div>
                )}

                {isRegistering && role === 'subject' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <label className="login-label">Manager Pairing Code</label>
                    <input className="login-input" type="text" placeholder="Enter 6-digit code"
                      value={managerCode} onChange={e => setManagerCode(e.target.value.toUpperCase())} disabled={loading}
                      style={{ textAlign: 'center', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'monospace' }} />
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontSize: 14,
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
                    {error}
                  </motion.div>
                )}

                <button type="submit" className="login-btn-primary" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : isRegistering ? 'Create Account' : 'Sign In'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '4px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: 12, color: '#4b5563', fontWeight: 500 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <button type="button" className="login-btn-secondary" disabled={loading}
                  onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
                  {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                </button>
              </form>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};
