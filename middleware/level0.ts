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
    if (user.level !== 0) {
      if (user.level >= 1) return navigateTo("/dashboard");
      userStore.signOut();
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }

    userStore.loggedIn = true;
    userStore.id = user.id;
    userStore.username = user.username;
    userStore.level = user.level;

    const student = await useMe();
    if (!student) {
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }

    // @ts-ignore
    userStore.student.is_pg = student.year === "PG";
    // @ts-ignore
    userStore.student = student;
    userStore.department = student.department.name;
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
