import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter for login endpoint - stricter
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 15 * 60, // per 15 minutes
  blockDuration: 15 * 60, // block for 15 minutes
});

// Rate limiter for password reset
const passwordResetLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60, // block for 1 hour
});

// General API rate limiter
const apiLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per minute
});

// Bulk upload rate limiter - more lenient
const bulkLimiter = new RateLimiterMemory({
  points: 5, // 5 bulk uploads
  duration: 5 * 60, // per 5 minutes
});

export default defineEventHandler(async (event) => {
  const path = event.path;
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  try {
    // Apply strict rate limiting to login endpoint
    if (path === '/api/users/me.post' || path.includes('/api/users/login')) {
      await loginLimiter.consume(ip);
    }
    // Apply strict rate limiting to password reset endpoints
    else if (path.includes('/api/users/password-reset')) {
      await passwordResetLimiter.consume(ip);
    }
    // Apply lenient rate limiting to bulk upload endpoint
    else if (path.includes('/api/mentees/bulk')) {
      await bulkLimiter.consume(ip);
    }
    // Apply general rate limiting to all other API endpoints
    else if (path.startsWith('/api/')) {
      await apiLimiter.consume(ip);
    }
  } catch (error) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
  }
});
