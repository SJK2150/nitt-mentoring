import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { createUserSchema } from "../../utils/validation.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    const auth = getHeader(e, "Authorization");
    
    if (!auth || !auth.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not logged in.",
      });
    }
    
    const token = auth.slice(7);
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
    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }
    
    const { username, password, level, name, department } = result.data;
    
    // Use environment BCRYPT_SALT
    const config = useRuntimeConfig();
    const saltRounds = parseInt(config.bcryptSalt || '12');
    const encryptedPass = await hash(password, saltRounds);
    const user = await client.prisma.users.create({
      data: {
        username,
        password: encryptedPass,
        level: Math.min(Math.max(level, 0), 3), // Ensure level is 0-3
      },
    });
    
    return { message: "Account created successfully!", id: user.id };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    
    if (err.code === "P2002") {
      throw createError({
        statusCode: 400,
        statusMessage: "An account with this username already exists.",
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
