import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const token = auth.slice(7);
  const jwtPayload = await verifyJwt(token);
  
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }

  const body = await readBody<{
    regno: string;
    name: string;
    year: string;
    section?: string;
    batch?: number;
    department: string;
    password: string;
    ugCGPA?: number;
    gateScore?: number;
    workExperience?: string;
  }>(e);

  

  // Core required fields validation
  const requiredFields = ['regno', 'name', 'year', 'department', 'password'];
  const missingRequiredFields = requiredFields.filter(field => !body[field as keyof typeof body]);

  if (missingRequiredFields.length > 0) {
    console.log(`Missing required fields: ${missingRequiredFields.join(', ')}`);
    throw createError({
      statusCode: 400,
      statusText: `Missing required fields: ${missingRequiredFields.join(', ')}`
    });
  }

  // Additional validation based on student type
  if (body.year === 'UG') {
    const ugRequiredFields = ['section', 'batch'];
    const missingUgFields = ugRequiredFields.filter(field => !body[field as keyof typeof body]);
    
    if (missingUgFields.length > 0) {
      console.log(`Missing UG student fields: ${missingUgFields.join(', ')}`);
      throw createError({
        statusCode: 400,
        statusText: `UG students must provide: ${missingUgFields.join(', ')}`
      });
    }
  }

  // PG students don't need section, batch, ugCGPA, or gateScore - they're all optional

  const encryptedPass = await hash(body.password, 10);

  try {
    let userCreated: any;
    let studentCreated: any;
    
    await client.prisma.$transaction(async (prisma) => {
      userCreated = await prisma.users.create({
        data: { 
          username: body.regno, 
          password: encryptedPass, 
          level: 0 
        },
      });

      studentCreated = await prisma.students.create({
        data: {
          register_no: body.regno,
          user_id: userCreated.id,
          name: body.name,
          year: body.year,
          section: body.year === 'UG' ? body.section : null,
          batch: body.year === 'UG' ? body.batch : null,
          department_id: body.department,
          ug_cgpa: body.year === 'PG' ? (body.ugCGPA || 0) : 0,
          gate_score: body.year === 'PG' ? (body.gateScore || 0) : 0,
          work_experience: body.year === 'PG' ? (body.workExperience || '') : ''
        },
      });
    });

    if (userCreated && studentCreated) {
      return { message: "Account created successfully!", id: userCreated.id };
    } else {
      throw new Error("Failed to create user or student");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "PrismaClientKnownRequestError") {
        const prismaError = err as PrismaClientKnownRequestError;
        if (prismaError.code === "P2002") {
          throw createError({
            statusCode: 400,
            statusText: err.message
          });
        }
      }
    }
    
    throw createError({
      statusCode: 400,
      statusText: "Error creating account"
    });
  }
});