<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Welcome Card -->
            <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fade-in">
                <div class="flex items-center gap-4">
                    <!-- Admin Icon Badge -->
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900">
                            Welcome, {{ userStore.username }}!
                        </h1>
                        <p class="text-gray-600 mt-1">
                            Administrator Dashboard
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
        color: 'blue',
        label: 'Users',
        onClick: () => navigateTo('/admin/users')
    },
    {
        icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'purple',
        label: 'Faculty',
        onClick: () => navigateTo('/admin/faculty/new')
    },
    {
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        color: 'green',
        label: 'Students',
        onClick: () => navigateTo('/admin/students/new')
    },
    {
        icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
        color: 'orange',
        label: 'Password',
        onClick: () => navigateTo('/admin/pass/edit')
    }
]

definePageMeta({
    middleware: [
        "level3"
    ]
})
</script>