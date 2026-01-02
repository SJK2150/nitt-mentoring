import config from "~/config";
import { Client } from "../../utils/database.js";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username } = body || {};

    if (!username) {
      return {
        statusCode: 400,
        body: { message: "username is required" },
      };
    }

    const user = await client.prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: { message: "User not found" },
      };
    }

    const token = jwt.sign({ username: user.username }, config.JWT_KEY, {
      expiresIn: "10m",
    });
    const resetLink = `${config.FRONTEND_URL}/change-password?token=${token}`;
    console.log(resetLink);
    await sendEmail(user.username + "@nitt.edu", resetLink);

    return {
      statusCode: 200,
      body: { message: "Password reset email sent successfully" },
    };
  } catch (error) {
    console.error("Error in password reset:", error);
    return {
      statusCode: 500,
      body: { message: "An error occurred while processing your request" },
    };
  }
});
