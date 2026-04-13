export default defineEventHandler(async () => {
  throw createError({
    statusCode: 503,
    statusMessage: "Forgot password is temporarily disabled.",
  });
});
