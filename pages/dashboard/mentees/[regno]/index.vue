<template>
    <div v-if="mentee" class="min-h-screen bg-nitMaroon-50 p-8 relative">
        <MiscGeometricBg />
        <div class="max-w-7xl mx-auto relative z-10">
            <InfoMentee v-if="mentee" :mentee="mentee" />
            
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 my-6 animate-slide-up">
                <a v-if="mentee" :href="`/dashboard/mentees/${mentee.register_number}/edit/special`"
                    class="px-6 py-3 bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white font-semibold rounded-lg transition-colors duration-300">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Special Info
                    </span>
                </a>
                
                <a v-if="mentee" :href="`/dashboard/mentees/${mentee.register_number}/meetings/new`"
                    class="px-6 py-3 bg-nitMaroon-500 hover:bg-nitMaroon-600 text-white font-semibold rounded-lg transition-colors duration-300">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        New Meeting
                    </span>
                </a>
            </div>
            
            <!-- Meetings Section -->
            <div class="mb-6 animate-slide-up" style="animation-delay: 0.1s">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">Meetings</h1>
                <div v-if="meetings.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="meeting, i in meetings" :key="`meeting_${meeting.id}`"
                        class="bg-white rounded-lg p-6 border border-nitMaroon-200 hover:border-nitMaroon-300 transition-all duration-300 group">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 group-hover:text-nitMaroon-600 transition-colors">Meeting #{{ i+1 }}</h3>
                                <p class="text-sm text-gray-500 mt-1">{{ new Date(meeting.date).toLocaleDateString('en-GB') }}</p>
                            </div>
                            <span class="w-8 h-8 rounded-full bg-nitMaroon-100 text-nitMaroon-600 flex items-center justify-center font-bold text-sm">
                                {{ i+1 }}
                            </span>
                        </div>
                        <p class="text-gray-700 line-clamp-3">{{ meeting.discussion }}</p>
                    </div>
                </div>
                <div v-else class="bg-white rounded-lg p-12 border border-nitMaroon-200 text-center">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-gray-600 font-medium">No meetings recorded yet</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Meeting } from "@/types/types.js"
definePageMeta({
    middleware: [
        "level1"
    ]
})
// const userStore = useUserStore()
const route = useRoute();

const regno = route.params.regno as string;

const mentee = await useMentee(regno)

const meetings = ref<Meeting[]>([])

if (!mentee) {
    nextTick(() => {
        alert("No such student exists with Reg #" + regno)
        navigateTo("/dashboard")
    })
} else {
    meetings.value = mentee.meetings.map(x => ({ ...x, date: new Date(x.date) })).sort((a, b) => b.date.getTime() - a.date.getTime());
    //  meetings.value = mentee.meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
</script>