import { compare, hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { verifyJwt } from "../../utils/jwt.js";
import { logAudit, getAuditContext } from "../../utils/auditLog.js";
import { z } from "zod";

const client = new Client();

const adminResetSchema = z.object({
  username: z.string().min(1, "Username is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default defineEventHandler(async (event) => {
  console.log('🔐 [ADMIN PASSWORD RESET] Request received');
  
  try {
    // Get JWT token from Authorization header or cookie
    let token: string | undefined;
    const authHeader = getHeader(event, "authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Try to get token from httpOnly cookie
      token = getCookie(event, "nitt_token");
    }
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authenticated",
      });
    }

    const jwtPayload = await verifyJwt(token);

    if (!jwtPayload) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }

    // Check if requesting user is admin (level 3)
    if (jwtPayload.level !== 3) {
      console.log(`❌ [ADMIN PASSWORD RESET] User level ${jwtPayload.level} attempted admin action`);
      throw createError({
        statusCode: 403,
        statusMessage: "Admin access required",
      });
    }

    const adminUser = await client.prisma.users.findUnique({
      where: { id: Number(jwtPayload.id) },
    });

    if (!adminUser) {
      throw createError({
        statusCode: 401,
        statusMessage: "Admin user not found",
      });
    }

    const body = await readBody(event);
    
    // Validate input
    const result = adminResetSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: validationMessage,
      });
    }

    const { username, newPassword } = result.data;
    
    console.log(`🔍 [ADMIN PASSWORD RESET] Admin ${adminUser.username} resetting password for: ${username}`);

    // Find target user
    const targetUser = await client.prisma.users.findUnique({
      where: { username },
    });

    if (!targetUser) {
      console.log(`❌ [ADMIN PASSWORD RESET] User ${username} not found`);
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    // Hash new password
    const config = useRuntimeConfig();
    const saltRounds = parseInt(config.bcryptSalt || '12');
    const hashedPassword = await hash(newPassword, saltRounds);

    // Update password
    await client.prisma.users.update({
      where: { username },
      data: { password: hashedPassword },
    });

    // Audit log
    const auditContext = getAuditContext(event);
    await logAudit({
      userId: adminUser.id,
      action: 'PASSWORD_RESET_BY_ADMIN',
      details: `Admin ${adminUser.username} reset password for user: ${username}`,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
    });

    console.log(`✅ [ADMIN PASSWORD RESET] Password reset successful for: ${username}`);

    return {
      success: true,
      message: `Password reset successfully for user: ${username}`,
    };
  } catch (error: any) {
    console.error('🔴 [ADMIN PASSWORD RESET] Error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
