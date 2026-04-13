import { Client } from "../../../../utils/database.js";

const client = new Client();
export default defineEventHandler(async (e) => {
  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const token = auth.slice(7);
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

  const regno = getRouterParam(e, "regno");
  const body = await readBody<{
    jee_rank?: number;
    jee_score?: number;
  }>(e);

  try {
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        jee_rank: body.jee_rank,
        jee_score: body.jee_score,
      },
    });

    return {
      message: "UG information updated successfully.",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusText: "Failed to update UG information.",
    });
  }
}); 