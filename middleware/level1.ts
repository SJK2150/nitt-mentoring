export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const userStore = useUserStore();

    // Always validate server session to avoid stale Pinia state when cookie expires/disappears.
    const session = await useUserSession();
    if (!session.ok) {
      if (session.statusCode && session.statusCode >= 500) {
        return abortNavigation(
          createError({
            statusCode: 503,
            statusMessage: "Service temporarily unavailable. Please try again.",
          })
        );
      }

      userStore.signOut();
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }

    const user = session.user;
    if (user.level < 1) {
      if (user.level === 0) return navigateTo("/student/me");
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }

    userStore.loggedIn = true;
    userStore.username = user.username;
    userStore.id = user.id;
    userStore.level = user.level;
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
