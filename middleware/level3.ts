export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const userStore = useUserStore();
    
    // Check if we already have user data in store to avoid refetching
    if (!userStore.loggedIn || !userStore.id) {
      const user = await useUser();
      if (!user || user.level < 3) {
        return navigateTo(`/login?redirect=${to.fullPath}`);
      }
      
      userStore.loggedIn = true;
      userStore.username = user.username;
      userStore.id = user.id;
      userStore.level = user.level;
    } else {
      // User data exists, just verify level
      if (userStore.level < 3) {
        return navigateTo(`/login?redirect=${to.fullPath}`);
      }
    }
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
