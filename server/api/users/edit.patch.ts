import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { editUserSchema } from "../../utils/validation.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    
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
        statusMessage: "Not logged in.",
      });
    }
    const jwtPayload = await verifyJwt(token);
    
    if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session expired. Please login again.",
      });
    }
    
    if (Number(jwtPayload.level) < 3) {
      throw createError({
        statusCode: 403,
        statusMessage: "You do not have permission.",
      });
    }
    
    // Validate input with Zod
    const result = editUserSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }
    
    const { username, level, name, password } = result.data;
    
    // Build update data object
    const updateData: any = {};
    if (level !== undefined) updateData.level = Math.min(Math.max(level, 0), 3);
    if (name !== undefined) updateData.name = name;
    if (password !== undefined) {
      const saltRounds = Number(process.env.BCRYPT_SALT) || 12;
      updateData.password = await hash(password, saltRounds);
    }
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No fields to update",
      });
    }
    
    const user = await client.prisma.users.update({
      where: { username },
      data: updateData,
    });

    return { message: "Account updated successfully!" };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    
    if (err.code === "P2025") {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    
    console.error("Error updating user:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
