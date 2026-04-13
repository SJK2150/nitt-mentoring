import { Client } from "../../../utils/database.js";
import { verifyJwt } from "../../../utils/jwt.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  const username = getRouterParam(e, "userId"); // now username

  if (!username || typeof username !== 'string') {
    throw createError({
      statusCode: 400,
      statusText: "Invalid username provided.",
    });
  }

  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const token = auth.slice(7);
  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || Date.now() / 1000 > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  // Only level 3 (admin) users can delete users
  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 403,
      statusText: "You do not have permission to delete users.",
    });
  }

  try {
    // Check if user exists by username
    const existingUser = await client.prisma.users.findUnique({
      where: { username },
      include: {
        mentor: true,  // faculty record
        mentee: true   // student record
      }
    });

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusText: "User not found.",
      });
    }

    // Prevent self-deletion
    if (existingUser.id.toString() === jwtPayload.id) {
      throw createError({
        statusCode: 400,
        statusText: "You cannot delete your own account.",
      });
    }

    // Use transaction to ensure data consistency
    await client.prisma.$transaction(async (prisma) => {
      // Delete related records first
      
      // If user is a faculty member, delete faculty record
      if (existingUser.mentor) {
        await prisma.faculty.delete({
          where: { user_id: existingUser.id }
        });
      }

      // If user is a student, delete student record and related data
      if (existingUser.mentee) {
        const studentRegNo = existingUser.mentee.register_no;
        
        // Delete academics records
        await prisma.academics.deleteMany({
          where: { register_no: studentRegNo }
        });

        // Delete meetings where student is mentee
        await prisma.meetings.deleteMany({
          where: { mentee_id: studentRegNo }
        });

        // Delete student record
        await prisma.students.delete({
          where: { user_id: existingUser.id }
        });
      }

      // Finally delete the user
      await prisma.users.delete({
        where: { username }
      });
    });

    return {
      message: "User deleted successfully.",
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error; // Re-throw our custom errors
    }

    throw createError({
      statusCode: 500,
      statusText: "Failed to delete user. Please try again.",
    });
  }
}); 