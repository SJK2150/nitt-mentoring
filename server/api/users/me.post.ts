import { compare } from "bcrypt";
import { Client } from "../../utils/database.js";
import { loginSchema } from "../../utils/validation.js";
import { logAudit, getAuditContext } from "../../utils/auditLog.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  const startTime = Date.now();
  console.log('🔍 [LOGIN] Request received at', new Date().toISOString());
  
  try {
    const body = await readBody(e);
    console.log('📝 [LOGIN] Username:', body.username);
    
    // Validate input with Zod
    console.log('⏱️ [LOGIN] Starting validation...');
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      console.log('❌ [LOGIN] Validation failed:', validationMessage);
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }
    console.log('✅ [LOGIN] Validation passed');

    const { username, password } = result.data;
    
    console.log('⏱️ [LOGIN] Querying database for user...');
    const dbStartTime = Date.now();
    const user = await client.prisma.users.findFirst({
      where: { username },
    });
    console.log(`✅ [LOGIN] Database query took ${Date.now() - dbStartTime}ms`);

    // Don't reveal if user exists or password is wrong - use same error
    if (!user) {
      console.log('❌ [LOGIN] User not found');
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }
    console.log('✅ [LOGIN] User found, checking password...');

    console.log('⏱️ [LOGIN] Starting bcrypt password comparison...');
    const bcryptStartTime = Date.now();
    const equal = await compare(password, user.password);
    console.log(`✅ [LOGIN] Bcrypt comparison took ${Date.now() - bcryptStartTime}ms`);
    
    if (!equal) {
      console.log('❌ [LOGIN] Password mismatch');
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }
    console.log('✅ [LOGIN] Password correct');

    console.log('⏱️ [LOGIN] Creating JWT token...');
    const jwtStartTime = Date.now();
    const token = await createJwt(`${user.id}`, user.level);
    console.log(`✅ [LOGIN] JWT creation took ${Date.now() - jwtStartTime}ms`);
    
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
    console.log('✅ [LOGIN] Cookie set');
    
    // Audit log successful login
    console.log('⏱️ [LOGIN] Writing audit log...');
    const auditStartTime = Date.now();
    const auditContext = getAuditContext(e);
    await logAudit({
      userId: user.id,
      action: 'LOGIN',
      details: `User ${username} logged in successfully`,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
    });
    console.log(`✅ [LOGIN] Audit log took ${Date.now() - auditStartTime}ms`);
    
    const totalTime = Date.now() - startTime;
    console.log(`🎉 [LOGIN] Total login time: ${totalTime}ms`);
    
    return { message: "Successfully logged in." };
  } catch (error: any) {
    console.log('❌ [LOGIN] Error occurred:', error.statusCode || 'unknown');
    console.error('🔴 [LOGIN] Full error details:', error);

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
    
    // Log error server-side but don't expose details to client
    if (error.statusCode !== 401 && error.statusCode !== 400) {
      console.error('🔴 [LOGIN] Unexpected error:', error);
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
