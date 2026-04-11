import { Client } from "../../utils/database.js";
import { hash, compare } from "bcrypt";
import { updatePasswordSchema } from "../../utils/validation.js";
import { logAudit, getAuditContext } from "../../utils/auditLog.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  // Check both Authorization header and httpOnly cookie
  let token: string | undefined;
  const authHeader = getHeader(e, "Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = getCookie(e, "nitt_token");
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not logged in",
    });
  }

  const jwtPayload = await verifyJwt(token);
  
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusMessage: "Session expired",
    });
  }

  try { 
    const body = await readBody(e);
    
    // Validate input
    const result = updatePasswordSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }

    const { username, oldPassword, newPassword } = result.data;
    
    // Verify user can only change their own password
    const requestingUser = await client.prisma.users.findFirst({
      where: { id: Number(jwtPayload.id) },
    });

    if (!requestingUser || requestingUser.username !== username) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }
    
    const user = await client.prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    
    const equal = await compare(oldPassword, user.password);
    
    if (!equal) {
      throw createError({
        statusCode: 401,
        statusMessage: "Current password is incorrect",
      });
    }
    
    // Use BCRYPT_SALT from environment
    const saltRounds = Number(process.env.BCRYPT_SALT) || 12;
    const encryptedPass = await hash(newPassword, saltRounds);
    
    await client.prisma.users.update({
      where: { username },
      data: { password: encryptedPass },
    });

    // Audit log password change
    const auditContext = getAuditContext(e);
    await logAudit({
      userId: user.id,
      action: 'PASSWORD_CHANGE',
      details: `User ${username} changed their password`,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
    });

    return { message: "Password changed successfully" };
  } catch (error: any) {
    // Don't log password-related errors
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Password change error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
  