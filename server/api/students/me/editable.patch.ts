export default defineEventHandler(async () => {
  throw createError({
    statusCode: 403,
    statusText: "This endpoint is disabled. Editing access is controlled by mentor toggle.",
  });
});
