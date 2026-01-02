import type { PartialStudent, Student } from "@/types/types.js";

export async function useMe(): Promise<Student | false> {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  try {
    const user = await $fetch<Student>(
      `/api/students/whoami`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      },
    );
    return user;
  } catch (e) {
    return false;
  }
}

export async function useMentee(): Promise<Student[]>;
export async function useMentee(
  regno: string,
): Promise<Student | false>;
export async function useMentee(regno?: string) {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  if (regno) {
    try {
      const user = await $fetch<Student>(
        `/api/mentees/${regno}`,
        {
          method: "GET",
          headers: { "Authorization": `Bearer ${auth.value}` },
        },
      );
      return user;
    } catch (e) {
      return false;
    }
  } else {
    const users = await $fetch<Student[]>(`/api/mentees/me`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${auth.value}` },
    });
    return users;
  }
}

export async function useSudoMentee(): Promise<Student[]>;
export async function useSudoMentee(
  regno: string,
): Promise<Student | false>;
export async function useSudoMentee(regno?: string) {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  if (regno) {
    try {
      const user = await $fetch<PartialStudent>(
        `/api/mentees/${regno}`,
        {
          method: "GET",
          headers: { "Authorization": `Bearer ${auth.value}` },
        },
      );
      return user;
    } catch (e) {
      return false;
    }
  } else {
    try {
      const users = await $fetch<PartialStudent[]>(`/api/mentees/dept`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }
}
