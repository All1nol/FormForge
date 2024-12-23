import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/templatesRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);

// Default Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

export default app;
