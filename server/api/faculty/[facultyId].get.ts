import { Client } from "../../utils/database.js";

const client = new Client();
export default defineEventHandler(async (e) => {
  // Check both Authorization header and httpOnly cookie
  let token: string | undefined;
  const authHeader = getHeader(e, "Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = getCookie(e, "nitt_token");
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  } else {
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
    const userId = getRouterParam(e, "facultyId");
    const user = await client.prisma.faculty.findFirst({
      where: { id: Number(userId) },
      include: {
        mentees: true,
        user: true
      }
    });
    if (user) {
      return {
        name: user.name,
        id: user.user_id,
        username: user.user.username,
        level: user.user.level,
        mentees: user.mentees,
        menteeCount: user.mentees.length
      };
    } else {
      throw createError({
        statusCode: 404,
      });
    }
  }
});
