import { Client } from "../../../../utils/database.js";
import { getTokenFromEvent } from "../../../../utils/auth";

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

  const regno = getRouterParam(e, "regno");
  const currentUser = await client.prisma.faculty.findFirst({
    where: { user_id: Number(jwtPayload.id) },
  });
  if (!currentUser) {
    throw createError({
      statusCode: 404,
      statusText: "You do not exist.",
    });
  }

  const student = await client.prisma.students.findUnique({
    where: { register_no: regno },
    include: { mentor: true },
  });

  if (!student) {
    throw createError({
      statusCode: 404,
      statusText: "Student not found.",
    });
  }

  if (
    Number(jwtPayload.level) === 1
    && student.mentor?.user_id !== Number(jwtPayload.id)
  ) {
    throw createError({
      statusCode: 403,
      statusText: "You can only toggle access for your mentees.",
    });
  }

  const body = await readBody<
    {
      value: boolean;
    }
  >(e);

  await client.prisma.students.update({
    where: { register_no: regno },
    data: {
      editable_personal: body.value,
    },
  });

  return {
    message: `Profile editing ${body.value ? "enabled" : "disabled"} successfully.`,
  };
});
