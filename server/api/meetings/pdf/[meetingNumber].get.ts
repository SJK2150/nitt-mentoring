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
    const meetingNumber = getRouterParam(e, "meetingNumber");
    if (!meetingNumber) return false;
    const meeting = await client.prisma.meetings.findMany({
        where: {
            meeting_number: parseInt(meetingNumber),
            mentor: {
                user_id: Number(jwtPayload.id)
            }
        },
        include: {
            mentee: {
                select: {
                    id: true,
                    register_no: true,
                    name: true
                }
            }
        },
    });
    if (meeting) {
        if (
            Number(jwtPayload.level) < 1) {
            throw createError({
                statusCode: 401,
                statusText: "You do not have permission.",
            });
        }
        return meeting;
    } else {
        throw createError({
            statusCode: 404,
        });
    }
});
