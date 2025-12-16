<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Faculty in {{ userStore.department }}</h1>
                <p class="text-gray-600 mt-1">Manage faculty mentor assignments</p>
            </div>

            <!-- Search -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div class="relative max-w-md">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        v-model="search"
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:border-transparent"
                        placeholder="Search by name..." 
                    />
                </div>
            </div>

            <!-- Faculty Grid -->
            <div v-if="mentors" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <a v-for="mentor in computedmentors" :key="mentor.id" :href="`/hod/faculty/${mentor.id}`"
                    class="block bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-nitMaroon-300 transition-all">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 rounded-full bg-nitMaroon-600 flex items-center justify-center text-white font-bold text-lg">
                            {{ mentor.name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">{{ mentor.name }}</h3>
                            <p class="text-sm text-gray-500">Staff ID: {{ mentor.id }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{{ mentor.mentee_count }} mentees</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: [
        "level2"
    ]
})
const userStore = useUserStore()
const mentors = await useAllFaculty();
const search = ref("")

const computedmentors = computed(() => {
    if (!search.value) return mentors
    return mentors.filter(x => 
        x.name.toLowerCase().includes(search.value.toLowerCase()) ||
        String(x.id).includes(search.value)
    )
})
</script>