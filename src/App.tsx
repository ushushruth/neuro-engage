import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveEEG } from './pages/LiveEEG';
import { Analysis } from './pages/Analysis';
import { Students } from './pages/Students';
import { Settings } from './pages/Settings';
import { StressClassifier } from './pages/StressClassifier';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eeg" element={<LiveEEG />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/students" element={<Students />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stress-classifier" element={<StressClassifier />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
