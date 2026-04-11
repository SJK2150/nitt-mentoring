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
  if (
    Number(jwtPayload.level) < 0
  ) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }

  const mentee = await client.prisma.students.findFirst({
    where: { user_id: Number(jwtPayload.id) },
    include: {
      meetings: true,
      mentor: true,
      academics: true,
      department: true,
    },
  });
  if (mentee) {
    return client.manager.createStudent(mentee);
  } else {
    throw createError({
      statusCode: 404,
    });
  }
});
