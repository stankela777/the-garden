import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import gardenRoutes from './routes/garden';
import journalRoutes from './routes/journal';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Apply a general rate limit to all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Stricter limiter for auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'the-garden-backend' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/garden', apiLimiter, gardenRoutes);
app.use('/api/journal', apiLimiter, journalRoutes);

app.listen(PORT, () => {
  console.log(`The Garden backend is growing on port ${PORT}`);
});

export default app;
