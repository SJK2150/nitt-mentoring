import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { createFacultySchema } from "../../utils/validation.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    
    // Check both Authorization header and cookie
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
    
    if (Number(jwtPayload.level) < 2) {
      throw createError({
        statusCode: 403,
        statusMessage: "You do not have permission.",
      });
    }
    
    // Validate input with Zod
    const result = createFacultySchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: result.error.issues[0]?.message || "Invalid input",
      });
    }
    
    let { faculty_id, username, password, level, name, department } = result.data;
    
    
    // Only level 3 (admin) can create HOD or admin accounts
    if (Number(jwtPayload.level) < 3 && level && level !== 1) {
      level = 1; // Force to regular faculty
    }
    
    // Use environment BCRYPT_SALT
    const config = useRuntimeConfig();
    const saltRounds = parseInt(config.bcryptSalt || '12');
    const encryptedPass = await hash(password, saltRounds);
    let userCreated: any;
    let facultyCreated: any;
    
    await client.prisma.$transaction(async (prisma) => {
      userCreated = await prisma.users.create({
        data: { 
          username, 
          password: encryptedPass, 
          level: level || 1 
        },
      });
      
      
      facultyCreated = await prisma.faculty.create({
        data: {
          id: parseInt(faculty_id),
          user_id: userCreated.id,
          name,
          department_id: department,
        },
      });
      
    });
    
    return { message: "Faculty account created successfully!", id: userCreated.id };
  } catch (err: any) {
    
    if (err.statusCode) {
      throw err;
    }
    
    if (err.code === "P2002") {
      throw createError({
        statusCode: 400,
        statusMessage: "An account with this username or faculty ID already exists.",
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Error creating account",
    });
  }
});
