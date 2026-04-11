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
  if (Number(jwtPayload.level) < 1) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }
  const user = await client.prisma.faculty.findFirst({
    where: { user_id: Number(jwtPayload.id) },
    include: { mentees: true, meetings: true, department: true },
  });
  if (user) {
    const users = user.mentees;
    return users.map((data) =>
      client.manager.createStudent({ ...data, mentor: user })
    );
  } else {
    throw createError({
      statusCode: 404,
      statusText: "No mentees found",
    });
  }
});
