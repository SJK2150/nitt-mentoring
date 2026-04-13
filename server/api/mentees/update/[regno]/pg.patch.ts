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
    ug_cgpa?: number;
    gate_score?: number;
    work_experience?: string;
  }>(e);

  try {
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        ug_cgpa: body.ug_cgpa,
        gate_score: body.gate_score,
        work_experience: body.work_experience,
      },
    });

    return {
      message: "PG information updated successfully.",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusText: "Failed to update PG information.",
    });
  }
}); 