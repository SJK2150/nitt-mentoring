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
  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }
  const current = await client.prisma.faculty.findFirst({
    where: { user_id: Number(jwtPayload.id) },
  });
  if (current) {
    const users = await client.prisma.students.findMany({
      where: { department_id: current.department_id },
      include: { mentor: true },
    });
    if (users) {
      return users.map((user) => client.manager.createPartialStudent(user));
    } else {
      // This def won't happen
      throw createError({
        statusCode: 404,
      });
    }
  } else {
    // This def won't happen
    throw createError({
      statusCode: 404,
    });
  }
});
