import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
import { Card, Input, Button } from '../components/UI';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
          <div className="flex flex-col mb-8">
            <div className="w-10 h-10 rounded bg-white flex items-center justify-center mb-6">
              <Brain size={20} className="text-black" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-white">Log in</h1>
            <p className="text-text-secondary mt-1 text-sm">
              Access the NeuroEngage monitoring system.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">Email</label>
              <Input 
                type="email" 
                placeholder="Ex: teacher@institute.edu" 
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <Input 
                type="password" 
                placeholder="Enter password" 
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={loading}
              className="mt-2 h-10"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={16} />}
              </span>
            </Button>
            
            <p className="mt-4 text-sm text-text-muted">
              Use any credentials to proceed.
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
