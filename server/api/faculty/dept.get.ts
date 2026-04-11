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

  const whereClause = current
    ? {
        department_id: current.department_id,
        user: { level: { in: [1, 2] } },
      }
    : {
        user: { level: { in: [1, 2] } },
      };

  const users = await client.prisma.faculty.findMany({
    where: whereClause,
    include: {
      department: true,
      mentees: true,
      user: true,
    },
  });

  return users.map((user) => ({
    ...client.manager.createPartialFaculty(user),
  }));
});
