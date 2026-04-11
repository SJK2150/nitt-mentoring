import { Client } from "../../utils/database";
import { hash } from "bcrypt";
import { passwordResetVerifySchema } from "../../utils/validation.js";
import { verifyResetCode, getRemainingAttempts } from "../../utils/passwordResetCodes.js";

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate input with Zod
    const result = passwordResetVerifySchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }

    const { username, code, newPassword } = result.data;

    // Verify the reset code
    const isValid = verifyResetCode(username, code);
    
    if (!isValid) {
      const remaining = getRemainingAttempts(username);
      throw createError({
        statusCode: 401,
        statusMessage: remaining > 0 
          ? `Invalid or expired code. ${remaining} attempts remaining.`
          : "Too many failed attempts. Please request a new code.",
      });
    }

    // Find user
    const user = await client.prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    // Hash new password with environment BCRYPT_SALT
    const config = useRuntimeConfig();
    const saltRounds = parseInt(config.bcryptSalt || '12');
    const encryptedPass = await hash(newPassword, saltRounds);

    // Update password
    await client.prisma.users.update({
      where: { username: username },
      data: { password: encryptedPass },
    });

    return {
      statusCode: 200,
      body: { message: "Password changed successfully" },
    };
  } catch (error: any) {
    console.error("Error in password change:", error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while processing your request",
    });
  }
});
