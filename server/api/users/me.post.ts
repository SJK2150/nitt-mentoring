import { compare } from "bcrypt";
import { Client } from "../../utils/database.js";

const client = new Client();
type UserCreds = {
  username: string;
  password: string;
};

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody<UserCreds>(e);
    
    console.log('Received body:', body);
    console.log('Body type:', typeof body);
    console.log('Username:', body?.username);
    console.log('Password exists:', !!body?.password);
    
    if (!body || !body.username || !body.password) {
      console.log('Validation failed - Missing credentials');
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body - Missing username or password",
      });
    }
    
    const user = await client.prisma.users.findFirst({
      where: { username: body.username },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusText: "User not found",
      });
    }

    const equal = await compare(body.password, user.password);
    if (equal) {
      const token = await createJwt(`${user.id}`, user.level);
      return { message: "Successfully logged in.", token };
    } else {
      throw createError({
        statusCode: 401,
        statusText: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusText: "Internal server error during login",
    });
  }
});
