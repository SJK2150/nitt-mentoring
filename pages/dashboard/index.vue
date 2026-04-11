<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8 relative">
        <MiscGeometricBg />
        <div class="max-w-4xl mx-auto relative z-10">
            <!-- Welcome Card -->
            <div class="bg-white rounded-lg border border-nitMaroon-200 p-8 animate-fade-in">
                <div class="flex items-center gap-4">
                    <!-- Faculty Icon Badge -->
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900">
                            Welcome, {{ userStore.username }}!
                        </h1>
                        <p class="text-gray-600 mt-1">
                            Faculty Dashboard
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions with Glass Icons -->
            <div class="mt-12 animate-slide-up" style="animation-delay: 0.1s">
                <h2 class="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
                <UiGlassIcons :items="quickActions" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const userStore = useUserStore()

const quickActions = [
    {
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        color: 'maroon',
        label: 'Mentees',
        onClick: () => navigateTo('/dashboard/mentees')
    },
    {
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        color: 'green',
        label: 'Meetings',
        onClick: () => navigateTo('/dashboard/mentees')
    },
    {
        icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
        color: 'orange',
        label: 'Password',
        onClick: () => navigateTo('/dashboard/password')
    }
]
if(userStore.level === 3) {
    navigateTo("/admin")
}

definePageMeta({
    middleware: [
        "level1"
    ]
})
</script>