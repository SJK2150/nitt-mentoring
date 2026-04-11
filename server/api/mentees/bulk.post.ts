import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";
import { createStudentSchema } from "../../utils/validation.js";

const client = new Client();

interface BulkResult {
  successful: Array<{ regno: string; name: string }>;
  failed: Array<{ regno: string; name: string; reason: string }>;
}

function getBulkRowErrorMessage(err: any): string {
  const code = err?.code;

  if (code === "P2002") {
    return "Student already exists";
  }

  if (code === "P2003") {
    return "Invalid department";
  }

  if (code === "P1001") {
    return "Database connection failed";
  }

  if (typeof err?.statusMessage === "string" && err.statusMessage.trim()) {
    return err.statusMessage;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  if (typeof err === "string" && err.trim()) {
    return err;
  }

  try {
    const serialized = JSON.stringify(err);
    if (serialized && serialized !== "{}") {
      return serialized;
    }
  } catch {
    // Fall through to generic error.
  }

  return "Unknown error";
}

export default defineEventHandler(async (e) => {
  console.log("🔍 [BULK UPLOAD] Starting bulk upload request");
  
  // Check authentication - try both cookie and header
  let token: string | undefined;
  const authHeader = getHeader(e, "Authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
    console.log("🔍 [BULK UPLOAD] Token from header: EXISTS");
  } else {
    token = getCookie(e, "nitt_token");
    console.log("🔍 [BULK UPLOAD] Token from cookie:", token ? "EXISTS" : "MISSING");
  }
  
  if (!token) {
    console.log("❌ [BULK UPLOAD] No token found");
    throw createError({
      statusCode: 401,
      statusMessage: "Not logged in - no token found",
    });
  }

  console.log("🔍 [BULK UPLOAD] Verifying JWT token");
  const jwtPayload = await verifyJwt(token);
  
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    console.log("❌ [BULK UPLOAD] JWT verification failed or expired");
    throw createError({
      statusCode: 401,
      statusMessage: "Session expired. Please login again.",
    });
  }

  console.log("🔍 [BULK UPLOAD] User level:", jwtPayload.level);
  
  if (Number(jwtPayload.level) < 2) {
    console.log("❌ [BULK UPLOAD] Insufficient permissions");
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission",
    });
  }
  
  console.log("✅ [BULK UPLOAD] Authentication successful");

  try {
    const body = await readBody(e);
    
    if (!Array.isArray(body) || body.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input: expected array of students",
      });
    }

    console.log(`📊 [BULK UPLOAD] Processing ${body.length} students`);

    const results: BulkResult = {
      successful: [],
      failed: []
    };

    const saltRounds = Number(process.env.BCRYPT_SALT) || 12;

    // Process each student
    for (const studentData of body) {
      try {
        const normalizedStudentData = {
          ...studentData,
          regno: String(studentData?.regno ?? "").trim(),
          name: String(studentData?.name ?? "").trim(),
          year: String(studentData?.year ?? "").trim().toUpperCase(),
          department: String(studentData?.department ?? "").trim().toUpperCase(),
          password: String(studentData?.password ?? ""),
          section: studentData?.section ? String(studentData.section).trim() : undefined,
          batch:
            studentData?.batch === "" || studentData?.batch === undefined || studentData?.batch === null
              ? undefined
              : Number(studentData.batch),
        };

        // Validate input with Zod
        const result = createStudentSchema.safeParse(normalizedStudentData);
        if (!result.success) {
          results.failed.push({
            regno: normalizedStudentData.regno || 'Unknown',
            name: normalizedStudentData.name || 'Unknown',
            reason: result.error.issues[0]?.message || 'Validation failed'
          });
          continue;
        }

        const validatedData = result.data;

        // Additional validation based on student type
        if (validatedData.year === 'UG') {
          if (!validatedData.batch || !validatedData.section) {
            results.failed.push({
              regno: validatedData.regno,
              name: validatedData.name,
              reason: 'UG students must provide batch and section'
            });
            continue;
          }
        }

        // Hash password
        const encryptedPass = await hash(validatedData.password, saltRounds);

        let userCreated: any;
        let studentCreated: any;
        
        // Create user and student in transaction
        await client.prisma.$transaction(async (prisma) => {
          // Create user
          userCreated = await prisma.users.create({
            data: { 
              username: validatedData.regno, 
              password: encryptedPass, 
              level: 0  // Always 0 for students
            },
          });

          // Prepare student data
          const studentCreateData: any = {
            register_no: validatedData.regno,
            user_id: userCreated.id,
            name: validatedData.name,
            year: validatedData.year,
            department_id: validatedData.department,
          };

          // Add UG-specific fields
          if (validatedData.year === 'UG') {
            studentCreateData.section = validatedData.section;
            studentCreateData.batch = validatedData.batch;
          }

          studentCreated = await prisma.students.create({
            data: studentCreateData,
          });
        });

        results.successful.push({
          regno: validatedData.regno,
          name: validatedData.name
        });
        console.log(`✅ [BULK UPLOAD] Created student: ${validatedData.regno}`);

      } catch (err: any) {
        const errorMessage = getBulkRowErrorMessage(err);
        console.log(`❌ [BULK UPLOAD] Failed for ${studentData?.regno}:`, errorMessage);

        results.failed.push({
          regno: studentData?.regno || 'Unknown',
          name: studentData?.name || 'Unknown',
          reason: errorMessage
        });
      }
    }

    console.log(`🎉 [BULK UPLOAD] Complete: ${results.successful.length} success, ${results.failed.length} failed`);

    return {
      success: true,
      total: body.length,
      successCount: results.successful.length,
      failedCount: results.failed.length,
      results: results
    };

  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    
    console.error('Bulk student creation error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: "Error processing bulk upload",
    });
  }
});
