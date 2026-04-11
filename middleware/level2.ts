export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const userStore = useUserStore();

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
    if (user.level < 2) {
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }

    userStore.loggedIn = true;
    userStore.username = user.username;
    userStore.id = user.id;
    userStore.level = user.level;

    // Level 2 users should always have a faculty profile with department.
    // Level 3 users may not, so keep existing department value for them.
    if (user.level === 2) {
      const faculty = await useFaculty();
      if (faculty && faculty.department?.name) {
        userStore.department = faculty.department.name;
      }
    }
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
