import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, User, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../components/UI';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<'subject' | 'manager' | null>(null);

  const handleLogin = (e: React.FormEvent, role: 'subject' | 'manager') => {
    e.preventDefault();
    setLoadingRole(role);
    localStorage.setItem('neuro_role', role);
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-base">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card className="p-8 border-border-subtle bg-bg-surface-elevated">
          <div className="flex flex-col mb-8 text-center items-center">
            <div className="w-12 h-12 rounded bg-white flex items-center justify-center mb-6">
              <Brain size={24} className="text-black" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-white mb-1">NeuroEngage Portal</h1>
            <p className="text-text-secondary text-sm">
              Select your authorization level to proceed.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              disabled={loadingRole !== null}
              onClick={(e) => handleLogin(e, 'subject')}
              className="h-14 flex items-center justify-start gap-4 px-6 border-border-subtle hover:border-white transition-colors"
            >
              <User size={20} className="text-text-secondary" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white font-medium">Log in as Subject</span>
                <span className="text-xs text-text-muted font-normal">View your personal metrics</span>
              </div>
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              disabled={loadingRole !== null}
              onClick={(e) => handleLogin(e, 'manager')}
              className="h-14 flex items-center justify-start gap-4 px-6 border-border-subtle hover:border-white transition-colors"
            >
              <ShieldCheck size={20} className="text-text-secondary" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white font-medium">Log in as Manager</span>
                <span className="text-xs text-text-muted font-normal">Monitor all class data & history</span>
              </div>
            </Button>
            
            {loadingRole && (
              <p className="mt-4 text-sm text-center text-text-muted animate-pulse">
                Authenticating...
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
