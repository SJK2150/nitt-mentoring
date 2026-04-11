import { Client } from "../../../utils/database.js";

const client = new Client();
export default defineEventHandler(async (e) => {
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
  }

  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  const currentStudent = await client.prisma.students.findUnique({
    where: { user_id: Number(jwtPayload.id) },
    select: { editable_personal: true },
  });

  if (!currentStudent) {
    throw createError({
      statusCode: 404,
      statusText: "Student profile not found.",
    });
  }

  if (!currentStudent.editable_personal) {
    throw createError({
      statusCode: 403,
      statusText: "Editing access is disabled by your mentor.",
    });
  }

  const body = await readBody<
    {
      positions_of_responsibility: string;
      scholarships: string;
      competitions: string;
      special_talents: string;
      role_model: string;
      objectives: string;
      extra_curricular: string;
    }
  >(e);
  await client.prisma.students.update({
    where: { user_id: Number(jwtPayload.id) },
    data: {
      positions_of_responsibility: body.positions_of_responsibility,
      scholarships: body.scholarships,
      competitions: body.competitions,
      special_talents: body.special_talents,
      role_model: body.role_model,
      objectives: body.objectives,
      extra_curricular: body.extra_curricular,
    },
  });
  return {
    message: "Successfully assigned mentor.",
  };
});
