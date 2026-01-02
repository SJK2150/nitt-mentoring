export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const userStore = useUserStore();
    
    // Check if we already have user data in store to avoid refetching
    if (!userStore.loggedIn || !userStore.id) {
      const user = await useUser();
      if (!user) {
        return navigateTo(`/login?redirect=${to.fullPath}`);
      }
      
      userStore.loggedIn = true;
      userStore.id = user.id;
      userStore.username = user.username;
      userStore.level = user.level;
      
      if (user.level === 0) {
        const student = await useMe();
        // @ts-ignore
        userStore.student.is_pg = student.year === "PG";      
        // @ts-ignore
        userStore.student = student;
        userStore.department = student ? student.department.name : "NONE"
      }
    }
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
