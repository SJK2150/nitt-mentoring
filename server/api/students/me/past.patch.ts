import { Client } from "../../../utils/database.js";
import { getTokenFromEvent } from "../../../utils/auth.js";

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

  const body = await readBody<{
    past: {
      sslc: {
        institution: string;
        board_of_study: string;
        year_of_study: string;
        percentage: string;
      };
      hsc: {
        institution: string;
        board_of_study: string;
        year_of_study: string;
        percentage: string;
      };
      jee?: {
        rank: number;
        score: number;
      };
      pg_feilds?: {
        ug_cgpa: number;
        gate_score: number;
        work_experience: string;
      };
    };
  }>(e);

  await client.prisma.students.update({
    where: { user_id: Number(jwtPayload.id) },
    data: {
      sslc_institution: body?.past?.sslc?.institution,
      sslc_board: body?.past?.sslc?.board_of_study,
      sslc_years: body?.past?.sslc?.year_of_study,
      sslc_percentage: body?.past?.sslc?.percentage,

      hsc_institution: body?.past?.hsc?.institution,
      hsc_board: body?.past?.hsc?.board_of_study,
      hsc_years: body?.past?.hsc?.year_of_study,
      hsc_percentage: body?.past?.hsc?.percentage,

      jee_score: body?.past?.jee?.score ?? null,
      jee_rank: body?.past?.jee?.rank ?? null,

      ug_cgpa: body?.past?.pg_feilds?.ug_cgpa ?? null,
      gate_score: body?.past?.pg_feilds?.gate_score ?? null,
      work_experience: body?.past?.pg_feilds?.work_experience ?? null,
    },
  });

  return {
    message: "Successfully changed Academic Qualifications",
  };
});
