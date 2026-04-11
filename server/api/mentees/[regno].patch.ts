import { Client } from "../../utils/database.js";
import { getTokenFromEvent } from "../../utils/auth.js";

const client = new Client();
export default defineEventHandler(async (e) => {
  const token = getTokenFromEvent(e);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }
  const regno = getRouterParam(e, "regno");
  if (
    Number(jwtPayload.level) < 2
  ) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }
  const body = await readBody<{ mentor_id: number }>(e);

  // Special case for unassigning a mentor
  if (body.mentor_id === -1) {
    await client.prisma.students.update({
      where: { register_no: regno },
      data: { mentor_id: null },
    });
    return {
      message: "Successfully unassigned mentor.",
    };
  }

  // For assigning a mentor, verify the mentor exists first
  const mentor = await client.prisma.faculty.findFirst({
    where: { id: body.mentor_id },
  });
  
  if (mentor) {
    await client.prisma.students.update({
      where: { register_no: regno },
      data: { mentor_id: body.mentor_id },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  } else {
    throw createError({
      statusCode: 404,
      statusMessage: "Mentor not found.",
    });
  }
});