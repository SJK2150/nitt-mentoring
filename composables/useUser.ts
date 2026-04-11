import type { Faculty, FacultyInfo, User } from "@/types/types.js";

type SessionFetchResult =
  | { ok: true; user: User }
  | { ok: false; statusCode?: number; statusMessage?: string };

export async function useUserSession(): Promise<SessionFetchResult> {
  try {
    const { data, error } = await useFetch<User>(`/api/users/me`, {
      method: "GET",
    });

    if (error.value) {
      return {
        ok: false,
        statusCode: error.value.statusCode,
        statusMessage: error.value.statusMessage,
      };
    }

    if (!data.value) {
      return { ok: false, statusCode: 401, statusMessage: "Not logged in." };
    }

    return { ok: true, user: data.value };
  } catch (_e) {
    return { ok: false, statusCode: 500, statusMessage: "Session check failed" };
  }
}

export async function useUser() {
  const session = await useUserSession();
  if (!session.ok) return false;
  return session.user;
}

export async function useFaculty(
  id?: number,
): Promise<(Faculty & { menteeCount: number }) | false> {
  try {
    const endpoint = id ? `/api/faculty/${id}` : `/api/faculty/me`;
    
    const { data, error } = await useFetch<(Faculty & { menteeCount: number })>(
      endpoint,
      {
        method: "GET",
      },
    );
    
    if (error.value) return false;
    return data.value || false;
  } catch (e) {
    return false;
  }
}

export async function useAllFaculty(): Promise<
  (FacultyInfo & { menteeCount: number })[]
> {
  try {
    const { data, error } = await useFetch<(FacultyInfo & { menteeCount: number })[]>(
      `/api/faculty/dept`,
      {
        method: "GET",
      },
    );
    
    if (error.value) return [] as (FacultyInfo & { menteeCount: number })[];
    return data.value || [] as (FacultyInfo & { menteeCount: number })[];
  } catch (e) {
    return [] as (FacultyInfo & { menteeCount: number })[];
  }
}

export async function useAllUsers(): Promise<
  ({ username: string; id: number; level: string })[]
> {
  try {
    const { data, error } = await useFetch<
      ({ username: string; id: number; level: string })[]
    >(
      `/api/users/all`,
      {
        method: "GET",
      },
    );
    
    if (error.value) return [];
    return data.value || [];
  } catch (e) {
    return [];
  }
}
