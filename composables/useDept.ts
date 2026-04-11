import type { Department } from "@/types/types.js";

export async function useDept(): Promise<Department[]> {
  try {
    // The httpOnly cookie (nitt_token) is automatically sent by the browser
    const dept = await $fetch<Department[]>(`/api/dept`, {
      method: "GET",
    });
    return dept || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}
