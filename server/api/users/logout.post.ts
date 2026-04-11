
import { revokeToken } from "../../utils/tokenRevocation.js";

/**
 * Logout endpoint - clears the authentication cookie and revokes token
 */
export default defineEventHandler(async (e) => {
  try {
    // Try to get user info from token for audit log
    const auth = getHeader(e, "Authorization");
    let userId: number | undefined;
    let token: string | undefined;
    
    if (auth && auth.startsWith("Bearer ")) {
      token = auth.slice(7);
      const jwtPayload = await verifyJwt(token);
      if (jwtPayload && (Date.now() / 1000) <= jwtPayload.exp) {
        userId = Number(jwtPayload.id);
        // Revoke the token
        revokeToken(token, jwtPayload.exp);
      }
    }
    
    // Also check cookie for token
    if (!token) {
      token = getCookie(e, "nitt_token");
      if (token) {
        const jwtPayload = await verifyJwt(token);
        if (jwtPayload) {
          userId = Number(jwtPayload.id);
          revokeToken(token, jwtPayload.exp);
        }
      }
    }
    
    // Clear the httpOnly cookie
    deleteCookie(e, "nitt_token", {
      path: '/',
    });
    
    // Audit log logout
    if (userId) {
      const auditContext = getAuditContext(e);
      await logAudit({
        userId,
        action: 'LOGOUT',
        details: `User logged out`,
        ipAddress: auditContext.ipAddress,
        userAgent: auditContext.userAgent,
      });
    }
    
    return { message: "Successfully logged out." };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookie even if audit logging fails
    deleteCookie(e, "nitt_token", { path: '/' });
    return { message: "Successfully logged out." };
  }
});
