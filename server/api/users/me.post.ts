import { compare } from "bcrypt";
import { Client } from "../../utils/database.js";
import { loginSchema } from "../../utils/validation.js";
import { logAudit, getAuditContext } from "../../utils/auditLog.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    
    // Validate input with Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }

    const { username, password } = result.data;

    const user = await client.prisma.users.findFirst({
      where: { username },
    });

    // Don't reveal if user exists or password is wrong - use same error
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    const equal = await compare(password, user.password);
    
    if (!equal) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    const token = await createJwt(`${user.id}`, user.level);
    
    // Set httpOnly cookie for security (prevents XSS attacks)
    const config = useRuntimeConfig();
    const isHttps = getRequestProtocol(e, { xForwardedProto: true }) === "https";
    const shouldUseSecureCookie = config.public.env === "production" && isHttps;
    setCookie(e, "nitt_token", token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: shouldUseSecureCookie, // Only over HTTPS in production
      sameSite: 'lax', // Keeps CSRF protection while avoiding strict cross-navigation drops
      maxAge: 60 * 60 * 2, // 2 hours (matches JWT expiration)
      path: '/', // Available across entire app
    });
    
    // Audit log successful login
    const auditContext = getAuditContext(e);
    await logAudit({
      userId: user.id,
      action: 'LOGIN',
      details: `User ${username} logged in successfully`,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
    });

    return { message: "Successfully logged in." };
  } catch (error: any) {

    if (error instanceof PrismaClientInitializationError) {
      throw createError({
        statusCode: 503,
        statusMessage: "Database unavailable. Please try again shortly.",
      });
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === "P1001") {
      throw createError({
        statusCode: 503,
        statusMessage: "Database unavailable. Please try again shortly.",
      });
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
