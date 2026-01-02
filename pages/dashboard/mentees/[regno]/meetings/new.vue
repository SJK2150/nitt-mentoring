<template>
    <div class="min-h-screen bg-nitMaroon-50 p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Mentee Info Card -->
            <div class="mb-6 animate-fade-in">
                <InfoMentee v-if="mentee" :mentee="mentee" />
            </div>
            
            <!-- New Meeting Form -->
            <div v-if="mentee" class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-8 animate-slide-up" style="animation-delay: 0.1s">
                <!-- Form Header -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center shadow-md">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">New Meeting</h1>
                            <p class="text-gray-600 text-sm mt-1">Record a new mentor-mentee meeting</p>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <form @submit="addMeeting" class="space-y-6">
                    <!-- Date Input -->
                    <div class="flex flex-col gap-2">
                        <label for="date_field" class="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Meeting Date
                        </label>
                        <input 
                            type="date" 
                            name="date_field" 
                            id="date_field"
                            :max="new Date().toISOString().split('T')[0]"
                            required
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-nitMaroon-500/20 transition-colors text-gray-900" 
                        />
                        <p class="text-xs text-gray-500">Select the date when the meeting took place</p>
                    </div>

                    <!-- Discussion Textarea -->
                    <div class="flex flex-col gap-2">
                        <label for="discussion_field" class="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Discussion Summary
                        </label>
                        <textarea 
                            name="discussion_field" 
                            id="discussion_field"
                            rows="6"
                            required
                            placeholder="Enter detailed discussion points, concerns raised, action items, etc."
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-nitMaroon-500/20 transition-colors resize-none text-gray-900 placeholder-gray-400"
                        ></textarea>
                        <p class="text-xs text-gray-500">Provide a comprehensive summary of topics discussed during the meeting</p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 pt-4">
                        <button 
                            type="submit"
                            class="flex-1 px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 hover:from-nitMaroon-700 hover:to-nitMaroon-800 text-white font-semibold rounded shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Meeting
                        </button>
                        <button 
                            type="button"
                            @click="router.back()"
                            class="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded border border-gray-300 shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        "level1"
    ]
})
const route = useRoute()
const router = useRouter()
const regNo = route.params.regno;
const mentee = await useMentee(regNo as string)
if (!mentee) nextTick(() => router.go(-1))
const auth = useCookie<string>("nitt_token");

const addMeeting = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
   
    const creds = {
        date: formData.get("date_field"),
        discussion: formData.get("discussion_field"),
        mentee_id: regNo,
    };
    await useFetch<{ token: string }>(`/api/meetings/new`, {
        method: "POST", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            navigateTo(`/dashboard/mentees/${regNo}/meetings`)
        },
        onResponseError({ request, response, options }) {
            alert("An error occurred");
            console.error(response);
            

        }
    })
}
</script>