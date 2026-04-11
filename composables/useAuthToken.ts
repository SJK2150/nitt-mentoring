/**
 * Get the authentication token cookie with secure settings
 * This prevents XSS attacks by setting httpOnly and other security flags
 */
export const useAuthToken = () => {
  const config = useRuntimeConfig();
  
  return useCookie<string>("nitt_token", {
    // httpOnly: true cannot be set from client-side code in Nuxt
    // This needs to be set when the cookie is created on the server
    secure: config.public.env === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 60 * 60 * 2, // 2 hours (matches JWT expiration)
    path: '/', // Available across entire app
  });
};
