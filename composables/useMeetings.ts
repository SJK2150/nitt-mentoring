import type { Meeting } from "@/types/types.js";

export async function useMeeting(id: number) {
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
  try {
    const meeting = await $fetch<Meeting>(
      `/api/meetings/${id}`,
      {
        method: "GET",
        headers,
      },
    );
    return meeting;
  } catch (_e) {
    return false;
  }
}
export async function useMeetings(mentorId: number) {
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
  if (!mentorId) return false;
  try {
    const meeting = await $fetch<Meeting>(
      `/api/meetings/${mentorId}`,
      {
        method: "GET",
        headers,
      },
    );
    if (!meeting) return [];
    return meeting;
  } catch (_e) {
    return [];
  }
}

export async function useMeetingsNumber(meetingNumber: number) {
  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
  if (!meetingNumber) return false;
  try {
    const meeting = await $fetch<Meeting>(
      `/api/meetings/pdf/${meetingNumber}`,
      {
        method: "GET",
        headers,
      },
    );
    if (!meeting) return [];
    return meeting;
  } catch (_e) {
    return [];
  }
}