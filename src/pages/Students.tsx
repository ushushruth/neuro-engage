import React, { useState, useEffect } from 'react';
import { Card, Input } from '../components/UI';
import { Search, UserCircle, ChevronDown, ChevronUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const C_LOAD = '#fca5a5';     
const C_FOCUS = '#ffffff';    
const C_ATTENTION = '#a1a1aa'; 

const generateSubjectHistory = (seed: number) => {
  return Array.from({ length: 14 }, (_, i) => {
    return {
      day: `Day ${i + 1}`,
      load: Math.abs(Math.cos(i * 0.4 + seed) * 30 + 50 + Math.random() * 10),
      focus: Math.abs(Math.sin(i * 0.3 + seed) * 20 + 70 + Math.random() * 10),
      attention: Math.abs(Math.sin(i * 0.5 + seed) * 15 + 75 + Math.random() * 10),
    };
  });
};

// Replaced static array with dynamic hook data

export const Students: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsList, setStudentsList] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('neuro_role') || 'manager';
    const isManager = role === 'manager';
    const pairingCode = localStorage.getItem('neuro_pairing_code');
    const userId = localStorage.getItem('neuro_user');

    const url = isManager ? `http://localhost:5001/api/sessions?managerCode=${pairingCode}` : `http://localhost:5001/api/sessions?userId=${userId}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const subjectMap = new Map();
          data.forEach(s => {
             if (!subjectMap.has(s.userId)) {
                subjectMap.set(s.userId, {
                   name: s.username || s.context?.username || 'Unknown Subject',
                   id: 'ST-' + s.userId.slice(-4).toUpperCase(),
                   stressLevel: s.avgStress || 'Neutral',
                   focus: s.avgFocus || '0%',
                   status: 'Offline',
                   history: generateSubjectHistory(Math.random()) // Temporary visualizer waveform
                });
             }
          });
          setStudentsList(Array.from(subjectMap.values()));
        }
      })
      .catch(err => console.error('Failed to fetch subjects:', err));
  }, []);

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredStudents = studentsList.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <header className="mb-4 border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-1">Subject Roster</h1>
          <p className="text-text-secondary text-sm">Monitor individual engagement and access detailed personal history.</p>
        </div>
        <div className="w-full max-w-sm">
          <Input 
            icon={<Search size={16} />} 
            placeholder="Search subjects by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-text-muted border border-dashed border-border-subtle rounded-md bg-bg-surface-elevated/20">
            No active subjects found. Give your 6-digit Pairing Code to your subjects so they can link to your account.
          </div>
        ) : filteredStudents.map((student, idx) => (
          <motion.div key={student.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="flex flex-col overflow-hidden transition-colors hover:border-border-highlight">
              {/* Main Card Header (Clickable) */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer gap-4 md:gap-0"
                onClick={() => toggleDetails(student.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-border-subtle border border-border-highlight flex items-center justify-center text-text-muted">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">{student.name}</h3>
                    <p className="text-xs text-text-secondary">Identifier: {student.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 md:gap-8 justify-between md:justify-end w-full md:w-auto">
                  <div className="flex flex-col md:items-end">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Avg Focus</p>
                    <p className="text-sm font-medium text-white">{student.focus}</p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Current State</p>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          student.stressLevel === 'High' ? 'text-status-stress border-status-stress/20' :
                          student.stressLevel === 'Elevated' ? 'text-status-anxious border-status-anxious/20' :
                          'text-status-calm border-status-calm/20'
                        }`}>
                      {student.stressLevel}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-text-muted md:ml-4 w-6">
                    {expandedId === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expandable History Section */}
              <AnimatePresence>
                {expandedId === student.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border-subtle bg-bg-base/50"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                        <h4 className="text-sm text-text-secondary flex items-center gap-2">
                          <History size={14} className="text-white" />
                          14-Day Personal Baseline History
                        </h4>
                        
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: C_LOAD}}></div> Load</span>
                          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: C_FOCUS}}></div> Focus</span>
                          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: C_ATTENTION}}></div> Attention</span>
                        </div>
                      </div>

                      <div className="h-48 w-full border border-border-subtle rounded-md p-1 bg-bg-surface-elevated/30">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={student.history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="day" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#27272a', borderRadius: '4px' }} 
                              labelStyle={{ display: 'none' }} 
                            />
                            <Area type="monotone" name="Cognitive Load" dataKey="load" stroke={C_LOAD} fillOpacity={0.1} fill={C_LOAD} isAnimationActive={false} strokeWidth={1} />
                            <Area type="monotone" name="Focus" dataKey="focus" stroke={C_FOCUS} fillOpacity={0} isAnimationActive={false} strokeWidth={1} />
                            <Area type="monotone" name="Attention" dataKey="attention" stroke={C_ATTENTION} fillOpacity={0} isAnimationActive={false} strokeWidth={1} strokeDasharray="3 3" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 flex gap-4 text-xs text-text-secondary">
                        <p>Subject is currently <strong>{student.status.toLowerCase()}</strong>.</p>
                        <p>Latest assessment: <strong>{student.stressLevel}</strong> stress risk.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
};
