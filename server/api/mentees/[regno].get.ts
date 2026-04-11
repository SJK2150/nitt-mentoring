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
  const mentee = await client.prisma.students.findFirst({
    where: { register_no: regno },
    include: {
      meetings: {
        orderBy: {
          id: "asc"
        }
      },
      mentor: true,
      academics: true,
      department: true
    }
  });
  if (mentee) {
    if (
      Number(jwtPayload.level) < 2 &&
      mentee.mentor?.user_id !== Number(jwtPayload.id)
    ) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    return client.manager.createStudent(mentee);
  } else {
    throw createError({
      statusCode: 404,
    });
  }
});
