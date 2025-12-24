import express from 'express';
import { initializeFiles } from './utils/fileHandler.js';
import agentsRouter from './routes/agents.js';
import reportsRouter from './routes/reports.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
  try {
    console.log('Initializing data files...');
    await initializeFiles();
    console.log('Data files ready!\n');

    app.get('/health', (req, res) => {
      res.json({ ok: true, message: 'Server is running' });
    });

    app.use('/agents', agentsRouter);
    app.use('/reports', reportsRouter);
    app.use('/users', usersRouter);

    app.use((req, res) => {
      res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
      });
    });

    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('  x-username and x-password');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
