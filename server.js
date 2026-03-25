import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['subject', 'manager'], default: 'subject' },
  pairingCode: String,
  managerCode: String
});

const sessionSchema = new mongoose.Schema({
  userId: String,
  username: String,
  managerCode: String,
  date: { type: Date, default: Date.now },
  duration: String,
  avgStress: String,
  avgFocus: String,
  context: {
    sleep: String,
    stress: String,
    caffeine: String,
    task: String
  },
  waves: Array
});

const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role, managerCode } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already taken.' });

    let newPairingCode = undefined;
    if (role === 'manager') {
      newPairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } else if (role === 'subject') {
      if (!managerCode) return res.status(400).json({ error: 'Manager Pairing Code is required for subjects.' });
      const managerCheck = await User.findOne({ pairingCode: managerCode, role: 'manager' });
      if (!managerCheck) return res.status(400).json({ error: 'Invalid Pairing Code. No matching manager found.' });
    }

    const user = new User({ username, password, role, pairingCode: newPairingCode, managerCode });
    await user.save();
    res.status(201).json({ userId: user._id, username: user.username, role: user.role, pairingCode: user.pairingCode, managerCode: user.managerCode });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

    res.status(200).json({ userId: user._id, username: user.username, role: user.role, pairingCode: user.pairingCode, managerCode: user.managerCode });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Session Routes
app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const { userId, managerCode } = req.query;
    let filter = {};
    
    // Strictly validate incoming tokens to prevent stringified nulls
    if (userId && userId !== 'undefined' && userId !== 'null') filter.userId = userId;
    if (managerCode && managerCode !== 'undefined' && managerCode !== 'null') filter.managerCode = managerCode;
    
    // Security Patch: Prevent accidental full-table scans if the frontend sends empty query parameters
    if (Object.keys(filter).length === 0) {
      return res.json([]);
    }
    
    const sessions = await Session.find(filter).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Database Initialization & Server Startup
const seedDatabase = async () => {
  try {
    const managerExists = await User.findOne({ username: 'manager' });
    if (!managerExists) {
      await User.create({ username: 'manager', password: 'password', role: 'manager', pairingCode: 'TEST99' });
      console.log('✅ Seeded dummy Manager account (manager / password) with code TEST99');
    }

    const subjectExists = await User.findOne({ username: 'subject' });
    if (!subjectExists) {
      const subject = await User.create({ username: 'subject', password: 'password', role: 'subject', managerCode: 'TEST99' });
      console.log('✅ Seeded dummy Subject account (subject / password)');

      const generateWaves = (seed) => {
        return Array.from({ length: 30 }, (_, i) => ({
          time: i,
          alpha: Math.abs(Math.sin(i * 0.2 + seed) * 30 + 30),
          beta: Math.abs(Math.cos(i * 0.3 + seed) * 40 + 40),
          gamma: Math.abs(Math.sin(i * 0.5 + seed) * 20 + 20),
          focus: Math.abs(Math.cos(i * 0.1 + seed) * 20 + 60),
          attention: Math.abs(Math.sin(i * 0.15 + seed) * 15 + 70)
        }));
      };

      await Session.insertMany([
        {
          userId: subject._id,
          username: 'subject',
          managerCode: 'TEST99',
          date: new Date(Date.now() - 86400000 * 1),
          duration: '45m',
          avgStress: 'High',
          avgFocus: '82%',
          context: { sleep: '4-6 Hours', stress: 'Moderate', caffeine: 'Yes', task: 'Studying' },
          waves: generateWaves(1)
        },
        {
          userId: subject._id,
          username: 'subject',
          managerCode: 'TEST99',
          date: new Date(Date.now() - 86400000 * 2),
          duration: '1h 10m',
          avgStress: 'Neutral',
          avgFocus: '91%',
          context: { sleep: '7+ Hours', stress: 'Low', caffeine: 'No', task: 'Reading / Relaxing' },
          waves: generateWaves(2)
        }
      ]);
      console.log('✅ Seeded 2 dummy sessions for the Subject account.');
    }
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
};

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('<db_password>')) {
      console.error('\n❌ CRITICAL DATABASE ERROR ❌');
      console.error('The database connection string in your .env file is missing or invalid.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ Connected successfully to Persistent MongoDB Atlas Cloud Cluster!`);
    
    await seedDatabase();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Backend Express server is running and listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start backend server:', err);
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});
