import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { createStudentSchema } from "../../utils/validation.js";
import { getTokenFromEvent } from "../../utils/auth";

const client = new Client();

export default defineEventHandler(async (e) => {
  const token = getTokenFromEvent(e);
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
      statusMessage: "Session expired. Please login again.",
    });
  }

  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission",
    });
  }

  try {
    const body = await readBody(e);
    
    // Validate input with Zod
    const result = createStudentSchema.safeParse(body);
    if (!result.success) {
      const validationMessage = result.error.issues[0]?.message || "Invalid input";
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
        message: validationMessage,
      });
    }

    const validatedData = result.data;

    // Additional validation based on student type
    if (validatedData.year === 'UG') {
      if (!validatedData.batch || !validatedData.section) {
        throw createError({
          statusCode: 400,
          statusMessage: "UG students must provide batch and section",
        });
      }
    }

    // Use BCRYPT_SALT from environment
    const saltRounds = Number(process.env.BCRYPT_SALT) || 12;
    const encryptedPass = await hash(validatedData.password, saltRounds);

    let userCreated: any;
    let studentCreated: any;
    
    await client.prisma.$transaction(async (prisma) => {
      // Create user with explicitly whitelisted fields (prevent mass assignment)
      userCreated = await prisma.users.create({
        data: { 
          username: validatedData.regno, 
          password: encryptedPass, 
          level: 0  // Always 0 for students
        },
      });

      // Create student with explicitly whitelisted fields
      const studentData: any = {
        register_no: validatedData.regno,
        user_id: userCreated.id,
        name: validatedData.name,
        year: validatedData.year,
        department_id: validatedData.department,
      };

      // Add UG-specific fields
      if (validatedData.year === 'UG') {
        studentData.section = validatedData.section;
        studentData.batch = validatedData.batch;
      }

      studentCreated = await prisma.students.create({
        data: studentData,
      });
    });

    return { message: "Account created successfully!", id: userCreated.id };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw createError({
          statusCode: 400,
          statusMessage: "Student with this registration number already exists",
        });
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Error creating account",
    });
  }
});
