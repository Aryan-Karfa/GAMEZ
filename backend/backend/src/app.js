import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config/env.js';
import { logger } from './lib/pino.js';
import prisma from './lib/prisma.js';
import routes from './routes/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.rawg.io"],
      imgSrc: ["'self'", "data:", "https://media.rawg.io", "*"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS Configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Request UUID & Logging Middleware
app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);

  const startTime = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    logger.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${durationMs}ms`,
      userId: req.user?.id || null
    }, 'HTTP request completed');
  });

  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GAMEZ API Running'
  });
});

// Readiness check route (observability check)
app.get('/api/ready', async (req, res) => {
  try {
    // 1. Verify Database Ping
    await prisma.$queryRaw`SELECT 1`;
    
    // 2. Verify RAWG configuration
    if (!config.rawgApiKey) {
      throw new Error('RAWG API key configuration missing');
    }

    res.status(200).json({
      success: true,
      ready: true,
      message: 'GAMEZ API is fully operational'
    });
  } catch (err) {
    logger.error({ error: err.message }, 'Readiness check failed');
    res.status(503).json({
      success: false,
      ready: false,
      message: `Readiness check failed: ${err.message}`
    });
  }
});

// Configure Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX, 10) || 5,
  message: { success: false, error: 'Too many authentication attempts. Please standby.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_REGISTER_MAX, 10) || 5,
  message: { success: false, error: 'Too many profile initialization attempts. Please standby.' },
  standardHeaders: true,
  legacyHeaders: false
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_SEARCH_MAX, 10) || 60,
  message: { success: false, error: 'Too many database scan queries. Access rate exceeded.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limits
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/register', registerLimiter);
app.use('/api/v1/games/search', searchLimiter);

// Central API Router
app.use('/api/v1', routes);

// Fallback for unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
