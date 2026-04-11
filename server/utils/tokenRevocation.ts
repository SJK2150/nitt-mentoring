/**
 * Token Revocation System
 * 
 * Tracks revoked JWT tokens to prevent their use after logout
 * In production, consider using Redis for distributed systems
 */

interface RevokedToken {
  token: string;
  revokedAt: number;
  expiresAt: number;
}

// In-memory storage (will be cleared on server restart)
const revokedTokens = new Map<string, RevokedToken>();

// Cleanup expired revoked tokens every hour
if (process.server) {
  setInterval(() => {
    const now = Date.now();
    for (const [token, data] of revokedTokens.entries()) {
      if (data.expiresAt < now) {
        revokedTokens.delete(token);
      }
    }
  }, 60 * 60 * 1000); // 1 hour
}

/**
 * Revoke a JWT token (e.g., on logout)
 * Token will be blocked until its expiration time
 */
export function revokeToken(token: string, expiresAt: number): void {
  revokedTokens.set(token, {
    token,
    revokedAt: Date.now(),
    expiresAt: expiresAt * 1000, // Convert to milliseconds
  });
}

/**
 * Check if a token has been revoked
 */
export function isTokenRevoked(token: string): boolean {
  const revoked = revokedTokens.get(token);
  
  if (!revoked) {
    return false;
  }
  
  // If token has expired, remove it and return false
  if (revoked.expiresAt < Date.now()) {
    revokedTokens.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Get count of currently revoked tokens (for monitoring)
 */
export function getRevokedTokenCount(): number {
  return revokedTokens.size;
}
