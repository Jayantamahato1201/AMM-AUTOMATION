import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// ==================== 1. HELMET SECURITY HEADERS ====================
export const securityHeaders = helmet({
  frameguard: false, // Allows the application to render within AI Studio iframe preview
  contentSecurityPolicy: false, // Disabled to prevent blocking Vite runtime scripts & iframe ancestors
  crossOriginEmbedderPolicy: false, // Prevents iframe preview breakages in development
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
});

// ==================== 2. CORS CONFIGURATION ====================
export const getCorsMiddleware = () => {
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map(o => o.trim())
    : [];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);

      // In development, allow localhost & cloud run preview origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Blocked by CORS policy. Origin not permitted.'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  });
};

// ==================== 3. RATE LIMITING ====================
// Standard API general limiter
export const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 180, // 180 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false, default: true },
  message: { error: 'Too many requests. Please slow down.' }
});

// Public enquiry/contact form submissions limiter (anti-spam)
export const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 enquiries per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false, default: true },
  message: { error: 'Enquiry rate limit exceeded. Please wait a few minutes before submitting again or call our office directly.' }
});

// Admin login brute-force rate limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 login attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false, default: true },
  message: { error: 'Too many failed login attempts. Account access is temporarily throttled for 15 minutes.' }
});

// AI solution advisor limiter
export const aiAdvisorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 queries per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false, default: true },
  message: { error: 'AI advisor rate limit exceeded. Please wait before asking another technical evaluation.' }
});

// ==================== 4. BRUTE-FORCE LOCKOUT TRACKER ====================
interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
}

const loginAttempts = new Map<string, LockoutEntry>();

export const bruteForceGuard = {
  isLocked(identifier: string): { locked: boolean; remainingSeconds?: number } {
    const entry = loginAttempts.get(identifier);
    if (!entry || !entry.lockedUntil) return { locked: false };

    const now = Date.now();
    if (now < entry.lockedUntil) {
      const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return { locked: true, remainingSeconds };
    }

    // Lock expired
    loginAttempts.delete(identifier);
    return { locked: false };
  },

  recordFailure(identifier: string): { locked: boolean; remainingSeconds?: number } {
    const now = Date.now();
    const entry = loginAttempts.get(identifier) || { attempts: 0, lockedUntil: null };
    entry.attempts += 1;

    if (entry.attempts >= 15) {
      // 15-minute temporary lockout
      entry.lockedUntil = now + 15 * 60 * 1000;
      loginAttempts.set(identifier, entry);
      return { locked: true, remainingSeconds: 15 * 60 };
    }

    loginAttempts.set(identifier, entry);
    return { locked: false };
  },

  recordSuccess(identifier: string): void {
    loginAttempts.delete(identifier);
  },

  resetAll(): void {
    loginAttempts.clear();
  }
};

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ==================== 5. SANITIZED LOGGING ====================
export const sanitizeLogData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  const sanitized: Record<string, any> = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('authorization') ||
      lowerKey.includes('apikey') ||
      lowerKey.includes('api_key')
    ) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      const sanitizedQuery = sanitizeLogData(req.query);
      const isAuthRoute = req.path.includes('/auth/');
      const sanitizedBody = isAuthRoute ? '[AUTH_PAYLOAD_REDACTED]' : sanitizeLogData(req.body);

      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`
      );
    }
  });
  next();
};

// ==================== 6. CENTRALIZED ERROR HANDLER ====================
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[Server Error] ${req.method} ${req.path}:`, {
    message: err.message,
    code: err.code,
    stack: isProd ? undefined : err.stack
  });

  res.status(statusCode).json({
    error: isProd && statusCode === 500
      ? 'An internal engineering server error occurred. Please contact AMM Automation technical support.'
      : err.message || 'An unexpected error occurred.',
    timestamp: new Date().toISOString()
  });
};
