import { jwtVerify, SignJWT } from "jose";
import config from "./../../config";
import { isTokenRevoked } from "./tokenRevocation.js";

// Encode KEY into a Uint8Array
const secret = new Uint8Array(Buffer.from(config.JWT_KEY, "hex"));
// const secret = new TextEncoder().encode(config.JWT_KEY);
// const privateKey = await importPKCS8(process.env.JWT_KEY, "RS256")

/** Generate JWT */
export async function createJwt(
  userId: string,
  level: number
): Promise<string> {
  const signer = new SignJWT({ id: userId, level: level })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime("2h");
  return await signer.sign(secret);
}

/** Verify the JWT and return the payload. */
export async function verifyJwt(
  token: string
): Promise<{ id: string; level: number; exp: number } | false> {
  try {
    // Check if token has been revoked (e.g., after logout)
    if (isTokenRevoked(token)) {
      return false;
    }
    
    const data = await jwtVerify(token, secret);
    // Check whether the payload has "id" and "exp".
    // This is most likely true.
    if (
      Object.hasOwn(data.payload, "id") &&
      Object.hasOwn(data.payload, "exp") &&
      Object.hasOwn(data.payload, "level")
    ) {
      return data.payload as { id: string; level: number; exp: number };
    } else return false; // shouldn't happen. If it does, immediately change JWT_KEY.
  } catch (e) {
    // Invalid JWT. Either the key changed or the token was not legit.
    return false;
  }
}
