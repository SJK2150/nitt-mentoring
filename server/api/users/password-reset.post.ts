import { Client } from "../../utils/database.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { passwordResetSchema } from "../../utils/validation.js";
import { generateResetCode, storeResetCode, hasResetCode } from "../../utils/passwordResetCodes.js";

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate input with Zod
    const result = passwordResetSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }

    const { username } = result.data;

    // Check if user already has a pending reset code
    if (hasResetCode(username)) {
      throw createError({
        statusCode: 429,
        statusMessage: "A password reset code was already sent. Please wait 10 minutes before requesting another.",
      });
    }

    const user = await client.prisma.users.findUnique({
      where: { username },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Still return success to prevent user enumeration
      return {
        statusCode: 200,
        body: { message: "If the user exists, a password reset code has been sent to their email." },
      };
    }

    // Generate 6-digit code
    const code = generateResetCode();
    
    const config = useRuntimeConfig();
    const emailBody = `
Your password reset code is: ${code}

This code will expire in 10 minutes.
You have 5 attempts to enter the correct code.

If you did not request this password reset, please ignore this email.`;

    console.log(`Password reset code for ${username}: ${code}`);
    
    // Determine email address
    // In development, use test email; in production, use @nitt.edu
    const isDevelopment = config.public.env === 'development';
    const emailAddress = isDevelopment && process.env.TEST_EMAIL
      ? process.env.TEST_EMAIL  // Use test email in development
      : user.username + "@nitt.edu";  // Use @nitt.edu in production
    
    console.log(`Sending password reset code to: ${emailAddress}`);
    
    // Send email with code.
    // In development, do not fail the entire flow if SMTP is unavailable.
    try {
      await sendEmail(
        emailAddress,
        "Password Reset Code - NITT Mentoring Portal",
        emailBody
      );
      storeResetCode(username, code);
    } catch (mailError: any) {
      const isDevelopmentRuntime = config.public.env === "development";
      if (isDevelopmentRuntime) {
        console.warn("Password reset email send failed in development mode. Falling back to console code.");
        console.warn(`DEV ONLY - Password reset code for ${username}: ${code}`);
        storeResetCode(username, code);
      } else {
        throw mailError;
      }
    }

    return {
      statusCode: 200,
      body: { message: "If the user exists, a password reset code has been sent to their email." },
    };
  } catch (error: any) {
    console.error("Error in password reset:", error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while processing your request",
    });
  }
});
