export function getTokenFromEvent(event: any): string | undefined {
  const authHeader = getHeader(event, "Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken && bearerToken !== "undefined" && bearerToken !== "null") {
      return bearerToken;
    }
  }

  return getCookie(event, "nitt_token");
}
