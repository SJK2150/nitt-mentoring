import { Client } from "../utils/database.js";

// Simple in-memory cache for departments (they rarely change)
let deptCache: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const client = new Client();
export default defineEventHandler(async (e) => {
  // Check both Authorization header and cookie
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
  
  // Check cache first
  const now = Date.now();
  if (deptCache && (now - cacheTime) < CACHE_TTL) {
    setHeader(e, 'X-Cache', 'HIT');
    setHeader(e, 'Cache-Control', 'public, max-age=3600');
    return deptCache;
  }
  
  // Fetch from database with optimized query
  const dept = await client.prisma.department.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    },
  });
  
  // Update cache
  deptCache = dept;
  cacheTime = now;
  
  setHeader(e, 'X-Cache', 'MISS');
  setHeader(e, 'Cache-Control', 'public, max-age=3600');
  
  return dept;
});
