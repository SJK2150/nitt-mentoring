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
    if (Number(jwtPayload.level) < 1) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    const user = await client.prisma.faculty.findFirst({
      where: { user_id: Number(jwtPayload.id) },
      include: { 
        department: true,
        // Only include mentee count, not full mentee data
        _count: {
          select: { mentees: true }
        }
      },
    });
    if (user) {
      return {
        ...client.manager.createPartialFaculty(user),
        mentee_count: user._count.mentees,
        department: user.department
      };
    } else {
      throw createError({
        statusCode: 404,
        statusText: "No mentees found",
      });
    }
  }
});
