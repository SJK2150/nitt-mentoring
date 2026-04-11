import { Student } from "../../../../types/types.js";
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
    Student["personal_info"]["mother"]
  >(e);
  await client.prisma.students.update({
    where: { user_id: Number(jwtPayload.id) },
    data: {
      m_name: body?.name,
      m_occupation: body?.occupation,
      m_mobile_number: body?.mobile_number,
      m_whatsapp_number: body?.whatsapp_number,
      m_email_id: body?.email_id,
      m_address: body?.address
    },
  });
  return {
    message: "Successfully assigned mentor.",
  };
});
