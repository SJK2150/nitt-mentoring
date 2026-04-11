import type { PartialStudent, Student } from "@/types/types.js";

export async function useMe(): Promise<Student | false> {
  try {
    const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
    const user = await $fetch<Student>(
      `/api/students/whoami`,
      {
        method: "GET",
        headers,
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
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
  if (regno) {
    try {
      const user = await $fetch<Student>(
        `/api/mentees/${regno}`,
        {
          method: "GET",
          headers,
        },
      );
      return user;
    } catch (e) {
      return false;
    }
  } else {
    const users = await $fetch<Student[]>(`/api/mentees/me`, {
      method: "GET",
      headers,
    });
    return users;
  }
}

export async function useSudoMentee(): Promise<Student[]>;
export async function useSudoMentee(
  regno: string,
): Promise<Student | false>;
export async function useSudoMentee(regno?: string) {
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
  if (regno) {
    try {
      const user = await $fetch<PartialStudent>(
        `/api/mentees/${regno}`,
        {
          method: "GET",
          headers,
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
        headers,
      });
      return users;
    } catch (e) {
      console.log(e);
      return [] as PartialStudent[];
    }
  }
}
