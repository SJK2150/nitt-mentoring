import { Client } from "../../utils/database.js";

interface findUserType {
  username: string,
  level: number,
  id: number | string,
  is_pg?: boolean
}

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
    const user = await client.prisma.users.findFirst({
      where: { id: Number(jwtPayload.id) },
      select: {
        id: true,
        username: true,
        level: true,
        // Don't fetch password hash for security
      },
    });
    if (user) {
      const result: findUserType = {
        username: user.username,
        level:    user.level,
        id:       user.id,
      };
      return result;
    } else {
      throw createError({
        statusCode: 404,
      });
    }
  }
});
