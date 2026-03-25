import React from 'react';
import { Card, Input } from '../components/UI';
import { Search, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const studentsList = [
  { name: 'Alex Johnson', id: 'ST-001', stressLevel: 'Neutral', focus: '88%', status: 'Online' },
  { name: 'Samantha Lee', id: 'ST-002', stressLevel: 'High', focus: '54%', status: 'Online' },
  { name: 'Michael Chen', id: 'ST-003', stressLevel: 'Elevated', focus: '72%', status: 'Offline' },
  { name: 'Emma Davis', id: 'ST-004', stressLevel: 'Neutral', focus: '92%', status: 'Online' },
  { name: 'William Smith', id: 'ST-005', stressLevel: 'Neutral', focus: '85%', status: 'Online' },
];

export const Students: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Student Roster</h1>
        <p className="text-text-secondary">Monitor individual student engagement and stress levels.</p>
      </header>

      <div className="w-full max-w-md mb-2">
        <Input icon={<Search size={18} />} placeholder="Search students by name or ID..." />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {studentsList.map((student, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card glass className="flex items-center justify-between p-4 hover:border-border-highlight cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted">
                  <UserCircle size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                  <p className="text-sm text-text-secondary">ID: {student.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:block">
                  <p className="text-xs text-text-muted">Avg Focus</p>
                  <p className="text-md font-medium text-white">{student.focus}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Current State</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-opacity-20 ${
                        student.stressLevel === 'High' ? 'text-status-stress bg-status-stress' :
                        student.stressLevel === 'Elevated' ? 'text-status-anxious bg-status-anxious' :
                        'text-status-calm bg-status-calm'
                      }`}>
                    {student.stressLevel}
                  </span>
                </div>
                <div className="items-center gap-2 hidden lg:flex">
                  <div className={`w-2 h-2 rounded-full ${student.status === 'Online' ? 'bg-status-calm' : 'bg-text-muted'}`}></div>
                  <span className="text-sm text-text-secondary">{student.status}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
