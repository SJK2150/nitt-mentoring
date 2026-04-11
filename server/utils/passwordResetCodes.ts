/**
 * Password Reset Code Storage
 * 
 * In production, consider:
 * 1. Using Redis for distributed systems
 * 2. Storing in database with expiry timestamp
 * 3. Adding rate limiting per username
 */

interface ResetCode {
  username: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory storage (will be cleared on server restart)
const resetCodes = new Map<string, ResetCode>();

// Cleanup expired codes every 5 minutes
if (process.server) {
  setInterval(() => {
    const now = Date.now();
    for (const [username, data] of resetCodes.entries()) {
      if (data.expiresAt < now) {
        resetCodes.delete(username);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Generate a 6-digit random code
 */
export function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store a reset code for a user (10 minute expiry)
 */
export function storeResetCode(username: string, code: string): void {
  resetCodes.set(username, {
    username,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  });
}

/**
 * Verify a reset code
 * Returns true if valid, false otherwise
 * Automatically increments attempt counter and removes after 5 failed attempts
 */
export function verifyResetCode(username: string, code: string): boolean {
  const data = resetCodes.get(username);
  
  if (!data) {
    return false; // No code found
  }
  
  if (data.expiresAt < Date.now()) {
    resetCodes.delete(username);
    return false; // Expired
  }
  
  if (data.attempts >= 5) {
    resetCodes.delete(username);
    return false; // Too many attempts
  }
  
  if (data.code !== code) {
    data.attempts++;
    return false; // Wrong code
  }
  
  // Valid code - remove it (one-time use)
  resetCodes.delete(username);
  return true;
}

/**
 * Check if a user already has a pending reset code
 */
export function hasResetCode(username: string): boolean {
  const data = resetCodes.get(username);
  return data !== undefined && data.expiresAt > Date.now();
}

/**
 * Get remaining attempts for a user
 */
export function getRemainingAttempts(username: string): number {
  const data = resetCodes.get(username);
  if (!data || data.expiresAt < Date.now()) {
    return 5;
  }
  return Math.max(0, 5 - data.attempts);
}
