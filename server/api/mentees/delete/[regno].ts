import { Client } from "../../../utils/database.js";
import { verifyJwt } from "../../../utils/jwt.js";
import { getTokenFromEvent } from "../../../utils/auth.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  const regnoStr = getRouterParam(e, "regno");
  const regno = regnoStr;

  if (!regno || typeof regno !== "string") {
    throw createError({
      statusCode: 400,
      statusText: "Invalid register number.",
    });
  }

  const token = getTokenFromEvent(e);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || Date.now() / 1000 > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 403,
      statusText: "You do not have permission.",
    });
  }

  try {
    // First get the student to find the user_id
    const student = await client.prisma.students.findUnique({
      where: { register_no: regno },
      select: { user_id: true, register_no: true }
    });

    if (!student) {
      throw createError({
        statusCode: 404,
        statusText: "Student not found.",
      });
    }

    // Delete both student and user records in a transaction
    await client.prisma.$transaction(async (prisma) => {
      // Delete dependent rows first to satisfy FK constraints.
      await prisma.meetings.deleteMany({
        where: { mentee_id: student.register_no },
      });

      await prisma.academics.deleteMany({
        where: { register_no: student.register_no },
      });

      // Delete student record
      await prisma.students.delete({
        where: { register_no: regno },
      });

      // Delete user record
      await prisma.users.delete({
        where: { id: student.user_id },
      });
    });

    return {
      message: "Student deleted successfully.",
    };
  } catch (error: any) {
    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusText: "Failed to delete student.",
    });
  }
});