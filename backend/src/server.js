import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import taskRoutes from './routes/tasks.js';
import { errorHandler } from './utils/errors.js';
import { taskModel } from './models/Task.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', taskRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Initialize database and start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  taskModel.initialize().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Task Board API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API endpoints: http://localhost:${PORT}/api/tasks`);
    });
  }).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}

export default app;
