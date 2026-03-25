import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/UI';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target, Brain, Radio, CheckCircle2, Play, ArrowRight, BatteryMedium, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COGNITIVE_TESTS: Record<string, { q: string, options: string[] }[]> = {
  "Logical Math": [
    { q: "What is 15% of 200?", options: ["30", "25", "35", "15"] },
    { q: "Solve: 8 + 2 × (5 - 3) ÷ 2", options: ["10", "12", "9", "14"] },
    { q: "If a train travels 60 miles in 45 minutes, what is its speed in mph?", options: ["80 mph", "75 mph", "90 mph", "100 mph"] },
    { q: "What is the square root of 225?", options: ["15", "25", "12", "17"] },
    { q: "Solve: 3³ - 2³", options: ["19", "25", "15", "27"] },
    { q: "If x + 5 = 12, what is 3x?", options: ["21", "24", "18", "27"] },
    { q: "What is the next number: 1, 1, 2, 3, 5, 8, _ ?", options: ["13", "11", "12", "15"] },
    { q: "How many degrees are in a triangle?", options: ["180", "360", "90", "270"] },
    { q: "What is 7 × 12?", options: ["84", "82", "78", "86"] },
    { q: "Convert 0.75 to a fraction.", options: ["3/4", "1/2", "2/3", "4/5"] }
  ],
  "Personal Empathy": [
    { q: "How do you recharge after a draining day?", options: ["Solitude and quiet", "Time with close friends", "Physical exercise", "Engaging in hobbies"] },
    { q: "When someone strongly disagrees with you, what is your first thought?", options: ["They misunderstand", "I must defend my view", "I want to hear their reason", "I want to walk away"] },
    { q: "What matters most in your daily life?", options: ["Freedom", "Security", "Achievement", "Connection"] },
    { q: "How do you handle sudden failure?", options: ["Analyze what went wrong", "Feel overwhelmed initially", "Brush it off and try again", "Seek comfort from others"] },
    { q: "Describe your ideal working environment.", options: ["Quiet and structured", "Fast-paced and collaborative", "Independent and flexible", "Creative and slightly chaotic"] },
    { q: "What is your primary motivator?", options: ["Curiosity", "Success", "Helping others", "Stability"] },
    { q: "When leading a group, you focus on:", options: ["Efficiency", "Morale", "Innovation", "Rules"] },
    { q: "How do you process anger?", options: ["Internalize it", "Express it immediately", "Channel it into action", "Talk it out calmly"] },
    { q: "What is your greatest fear?", options: ["Failure", "Rejection", "Loss of control", "Stagnation"] },
    { q: "How adaptable are you to sudden changes?", options: ["Very adaptable", "Somewhat, with effort", "I prefer routine", "I heavily resist it"] }
  ],
  "Real Life Scenarios": [
    { q: "You realize you forgot your wallet at the grocery checkout. What do you do?", options: ["Ask to hold the items while you return", "Put everything back silently", "Ask if they accept digital pay", "Panic and leave the store"] },
    { q: "A colleague takes credit for your work. How do you respond?", options: ["Confront them privately", "Call them out publicly", "Inform your manager", "Let it go to avoid conflict"] },
    { q: "You accidentally scratch a parked car. No one saw.", options: ["Leave a note with your number", "Drive away immediately", "Wait for the owner", "Call the police"] },
    { q: "Your flight gets cancelled 2 hours before takeoff.", options: ["Demand a refund immediately", "Quickly rebook the next available flight", "Wait for airline instructions", "Give up and go home"] },
    { q: "A friend borrows money and forgets to pay it back.", options: ["Remind them directly", "Drop subtle hints", "Write it off as a loss", "Wait for them to remember"] },
    { q: "You witness someone being harassed on the street.", options: ["Intervene directly", "Call the authorities", "Record it for evidence", "Walk away quickly"] },
    { q: "You are given too much change by a struggling cashier.", options: ["Return the extra money", "Keep it and walk away", "Donate it later", "Only tell them if they notice"] },
    { q: "A promotion requires relocating away from your family.", options: ["Accept it for the career", "Decline it for the family", "Negotiate a compromise", "Take time to over-analyze"] },
    { q: "You drop your phone in water.", options: ["Put it in rice", "Try to turn it on immediately", "Take it to a repair shop", "Assume it's dead"] },
    { q: "You are late for a highly important meeting.", options: ["Call ahead to inform them", "Rush and hope they don't notice", "Make up a fake excuse", "Cancel and reschedule"] }
  ],
  "Hypothetical Situations": [
    { q: "You find a button that pauses time for everyone but you. You...", options: ["Use it to sleep longer", "Use it to learn everything", "Never use it", "Use it for personal gain"] },
    { q: "If you could live forever, but you'd continue to age, would you?", options: ["Yes", "No", "Only if I have wealth", "Only if my family does too"] },
    { q: "You can save 10 strangers or your beloved pet from a fire.", options: ["The 10 strangers", "My pet", "Try to save both", "I cannot decide"] },
    { q: "You are offered $1 Million, but a random person dies.", options: ["Take the money", "Decline the money", "Find out who the person is first", "Only if it's someone bad"] },
    { q: "You discover we are living in a simulation. Do you tell anyone?", options: ["Tell the whole world", "Tell only close family", "Keep it a secret", "Try to break the simulation"] },
    { q: "If you could teleport anywhere, but only once, where do you go?", options: ["Another habitable planet", "Inside a bank vault", "To my dream vacation", "I'd save it for an emergency"] },
    { q: "You can erase one event from your past.", options: ["A major failure", "A traumatic memory", "An embarrassing moment", "I wouldn't change anything"] },
    { q: "You must survive a zombie apocalypse. Your chosen weapon is:", options: ["A crowbar", "A suppressed rifle", "A katana", "A fortified bunker"] },
    { q: "If animals could talk, which species would be the rudest?", options: ["Cats", "Seagulls", "Geese", "Chihuahuas"] },
    { q: "You find out tomorrow is the end of the world.", options: ["Spend it with loved ones", "Do everything I was afraid of", "Try to stop it", "Accept it peacefully"] }
  ],
  "Problem Solving": [
    { q: "You have a 3-gallon jug and a 5-gallon jug. How do you measure exactly 4 gallons?", options: ["Fill 5, pour to 3, empty 3, pour 2 to 3, fill 5, top off 3.", "It's impossible", "Fill both halfway", "Guess by looking at the water level"] },
    { q: "A room has 3 light switches outside. Inside are 3 bulbs. You can only enter once.", options: ["Turn 1 on for 10 mins, turn it off, turn 2 on, go in. Feel for heat.", "Flick them randomly", "It's impossible", "Look under the door"] },
    { q: "How do you drop an egg onto a concrete floor without cracking the floor?", options: ["Concrete is harder than egg", "Cook it first", "Wrap it in bubbles", "Drop it slowly"] },
    { q: "You have 8 balls. One is slightly heavier. You have a balance scale and 2 uses.", options: ["Weigh 3 vs 3. Narrow it down progressively.", "Weigh 4 vs 4, then 2 vs 2", "Weigh 1 vs 1 repeatedly", "Guess"] },
    { q: "A man shaves several times a day but still has a beard. Who is he?", options: ["A barber", "A werewolf", "A wizard", "An actor"] },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", options: ["The letter M", "A heartbeat", "A thought", "The sun"] },
    { q: "You are stuck in a dark room with a candle, a wood stove, and a gas lamp. You only have one match. What do you light first?", options: ["The match", "The candle", "The gas lamp", "The stove"] },
    { q: "I speak without a mouth and hear without ears.", options: ["An echo", "A ghost", "The wind", "A phone"] },
    { q: "The more of this there is, the less you see.", options: ["Darkness", "Fog", "Water", "Light"] },
    { q: "What has keys but can't open locks?", options: ["A piano", "A map", "A treasure chest", "A monkey"] }
  ],
  "Critical Thinking": [
    { q: "If A implies B, and B implies C, does not C imply not A?", options: ["Yes (Modus Tollens)", "No", "Sometimes", "Only in mathematics"] },
    { q: "Why is correlation not causation?", options: ["A third variable could cause both", "Math is subjective", "Statistics are flawed", "It is causation if the p-value is low"] },
    { q: "Which argument is a 'Straw Man' fallacy?", options: ["Misrepresenting an opponent's argument to easily defeat it", "Attacking the person instead of the argument", "Assuming something is true because everyone thinks so", "Using a celebrity endorsement"] },
    { q: "Is it possible for a statement to be neither true nor false?", options: ["Yes, paradoxes like 'This statement is false'", "No, logic is binary", "Only in philosophy", "Only if it's a question"] },
    { q: "If everyone claims a specific diet works, what is the best cognitive approach?", options: ["Look for blinded studies", "Try it yourself immediately", "Assume it's a scam", "Trust the majority"] },
    { q: "When presented with contradicting evidence to your core beliefs:", options: ["Objectively analyze the new data", "Dismiss it as flawed", "Defend your core belief harder", "Immediately change your mind"] },
    { q: "What is Occam's Razor?", options: ["The simplest explanation is usually the right one", "Always assume the worst", "Cut out useless variables in math", "Never trust coincidences"] },
    { q: "If a test is 99% accurate, and you test positive for a rare disease, are you 99% likely to have it?", options: ["No, due to the base rate fallacy", "Yes, it's 99% accurate", "It's 100% certain", "It's 50/50"] },
    { q: "What is the sunk cost fallacy?", options: ["Continuing a failing endeavor because of past investments", "Selling stocks too early", "Refusing to spend money on tools", "Assuming success brings more success"] },
    { q: "How do you evaluate source reliability?", options: ["Check for bias, methodology, and cross-references", "Trust highly-followed accounts", "If it sounds logical, it is", "Only trust government sources"] }
  ]
};

const QuizSidebar = ({ selectedTest, quizIndex, setQuizIndex, onSelectTest }: { selectedTest: string | null; quizIndex: number; setQuizIndex: (i: number) => void; onSelectTest: (t: string) => void }) => {
  if (!selectedTest) {
    return (
      <Card className="h-full border-border-subtle bg-white flex flex-col p-6 min-h-[400px]">
         <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-6">Select Cognitive Battery</h3>
         <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-2">
           {Object.keys(COGNITIVE_TESTS).map((testName) => (
             <Button 
               key={testName} 
               variant="outline" 
               className="border-gray-300 text-black hover:border-black font-medium justify-start" 
               style={{ color: '#000000' }} 
               onClick={() => onSelectTest(testName)}
             >
               {testName} (10 Qs)
             </Button>
           ))}
         </div>
      </Card>
    );
  }

  const activeQuizArray = COGNITIVE_TESTS[selectedTest];

  if (quizIndex >= activeQuizArray.length) {
    return (
      <Card className="h-full border-border-subtle bg-bg-surface-elevated/50 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-status-calm/10 border border-status-calm/20 text-status-calm flex items-center justify-center mb-6">
          <BrainCircuit size={32} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">{selectedTest} Completed</h3>
        <p className="text-text-secondary text-sm">Your cognitive baseline during active decision-making has been successfully logged. You may continue monitoring or stop the session.</p>
      </Card>
    );
  }

  const q = activeQuizArray[quizIndex];

  return (
    <Card className="h-full border-border-subtle bg-white flex flex-col p-6 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{selectedTest}</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">Q {quizIndex + 1} / {activeQuizArray.length}</span>
      </div>
      
      <p className="text-lg font-semibold text-black leading-relaxed mb-8">{q.q}</p>
      
      <div className="flex flex-col gap-3 mt-auto">
        {q.options.map((opt, i) => (
          <Button 
            key={i} 
            variant="outline" 
            className="justify-start text-left h-auto py-3 px-4 border-gray-300 font-medium hover:border-black hover:bg-gray-100 transition-all"
            style={{ color: '#000000' }}
            onClick={() => setQuizIndex(quizIndex + 1)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
};

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

type SessionState = 'IDLE' | 'QUESTIONNAIRE' | 'HARDWARE_CHECK' | 'ACTIVE' | 'COMPLETED';

export const LiveEEG: React.FC = () => {
  const [sessionState, setSessionState] = useState<SessionState>('IDLE');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  
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
    totalAttention: initialData.reduce((acc, curr) => acc + curr.attention, 0),
    count: 30
  });

  const [sessionAvgFocus, setSessionAvgFocus] = useState(statsRef.current.totalFocus / 30);
  const [sessionAvgBeta, setSessionAvgBeta] = useState(statsRef.current.totalBeta / 30);
  const [sessionAvgAttention, setSessionAvgAttention] = useState(statsRef.current.totalAttention / 30);

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
        statsRef.current.totalAttention += attention;
        statsRef.current.count += 1;
        setSessionAvgFocus(statsRef.current.totalFocus / statsRef.current.count);
        setSessionAvgBeta(statsRef.current.totalBeta / statsRef.current.count);
        setSessionAvgAttention(statsRef.current.totalAttention / statsRef.current.count);

        newData.push({ time: lastTime + 1, alpha, beta, gamma, focus, attention });
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  const handleAnswer = (question: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const isQuestionnaireComplete = Object.keys(answers).length === 4;

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

              {/* Question 4 */}
              <div>
                <p className="text-white font-medium mb-3">4. What primary task will you be performing during this session?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Studying', 'Problem Solving', 'Reading / Relaxing', 'Take a Cognitive Quiz'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer('task', opt)}
                      className={`py-2 px-3 border rounded text-sm transition-all ${answers['task'] !== opt ? 'border-border-subtle text-text-secondary hover:border-border-highlight' : ''}`}
                      style={answers['task'] === opt ? activeStyle : {}}
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

  if (sessionState === 'COMPLETED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-fade-in text-center px-4">
        <div className="w-20 h-20 rounded-full bg-status-calm/5 border border-status-calm/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(134,239,172,0.15)]">
          <CheckCircle2 size={32} className="text-status-calm" />
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-white mb-2">Session Complete</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-10 leading-relaxed">
          Your telemetry has been successfully recorded. Here is a brief summary of your cognitive performance for this timeframe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 w-full max-w-lg">
          <Card className="p-6">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Final Focus Score</p>
            <h3 className="text-4xl font-medium text-white tracking-tight">{(sessionAvgFocus).toFixed(0)}<span className="text-lg text-text-muted ml-1">%</span></h3>
          </Card>
          <Card className="p-6">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Final Attention Span</p>
            <h3 className="text-4xl font-medium text-white tracking-tight">{(sessionAvgAttention).toFixed(0)}<span className="text-lg text-text-muted ml-1">%</span></h3>
          </Card>
        </div>

        <Button 
          onClick={() => {
            setSessionState('IDLE');
            setHwStatus('waiting');
            setAnswers({});
            setQuizIndex(0);
            setSelectedTest(null);
          }} 
          className="h-12 px-8 text-base transition-all duration-300 hover:scale-[1.03]" 
          style={{ backgroundColor: '#ffffff', color: '#000000', boxShadow: '0 0 25px rgba(255,255,255,0.25)' }}
        >
          Restart Session
        </Button>
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
          <Button className="h-8 py-0 text-xs px-3 transition-opacity hover:opacity-80" style={{ backgroundColor: 'transparent', color: '#fca5a5', border: '1px solid rgba(252,165,165,0.4)', boxShadow: '0 0 15px rgba(252,165,165,0.1)' }} onClick={async () => {
            const payload = {
              userId: localStorage.getItem('neuro_user') || 'Admin',
              username: localStorage.getItem('neuro_username') || 'Unknown Subject',
              managerCode: localStorage.getItem('neuro_manager_code') || '',
              date: new Date(),
              duration: 'Live Session',
              avgStress: sessionAvgBeta > 70 ? 'High' : sessionAvgBeta > 55 ? 'Elevated' : 'Neutral',
              avgFocus: `${(sessionAvgFocus).toFixed(0)}%`,
              context: {
                ...answers,
                battery: selectedTest
              },
              waves: eegData 
            };
            try {
              await fetch('http://localhost:5001/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            } catch(e) { 
              console.error('Failed to save session to DB:', e); 
            }
            setSessionState('COMPLETED');
          }}>Stop Session</Button>
          <div className="flex items-center gap-2 bg-status-calm/10 px-3 py-1.5 rounded border border-status-calm/20">
            <span className="w-2 h-2 rounded-full bg-status-calm animate-pulse"></span>
            <span className="text-status-calm text-xs font-medium uppercase tracking-wider">Sensors Active</span>
          </div>
        </div>
      </header>

      {/* Dynamic Content Area: 100% width or split 2/3s and 1/3 for Quiz */}
      <div className={answers.task === 'Take a Cognitive Quiz' ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "flex flex-col gap-6"}>
        
        {/* Main Telemetry Block */}
        <div className={answers.task === 'Take a Cognitive Quiz' ? "lg:col-span-8 flex flex-col gap-6" : "w-full flex flex-col gap-6"}>
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
                <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Overall Stress</p>
                <h3 className={`text-2xl font-medium tracking-tight ${sessionAvgBeta > 70 ? 'text-status-stress' : 'text-white'}`}>
                  {sessionAvgBeta > 70 ? 'High' : sessionAvgBeta > 55 ? 'Elevated' : 'Neutral'}
                </h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Emotion</p>
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {sessionAvgBeta > 70 ? 'Anxious' : sessionAvgBeta > 55 ? 'Focused' : 'Calm'}
                </h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Cumul. Focus</p>
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
                  <div className="flex items-center gap-4 text-xs text-text-muted hidden sm:flex">
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
                  <div className="flex items-center gap-4 text-xs text-text-muted hidden sm:flex">
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

        {/* Optional Active Quiz Sidebar */}
        {answers.task === 'Take a Cognitive Quiz' && (
          <div className="lg:col-span-4 sticky top-6">
            <QuizSidebar 
              selectedTest={selectedTest}
              onSelectTest={setSelectedTest}
              quizIndex={quizIndex} 
              setQuizIndex={setQuizIndex} 
            />
          </div>
        )}

      </div>
    </div>
  );
};
