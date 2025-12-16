<template>
    <div class="tracking-wide flex flex-col items-center min-h-screen">
        <section class="flex w-full min-h-screen">
            <UiHeader />

            <main class="flex-1 flex flex-col transition-all duration-300 ml-20">
                <!-- Top Navigation Bar -->
                <section class="w-full bg-white shadow-sm sticky top-0 z-40">
                    <div class="flex items-center justify-between px-8 py-4">
                        <!-- Left: Logo and Title -->
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center shadow-md">
                                <img src="/nitt_logo_min.webp" class="w-8 h-8" />
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-gray-900">NIT Trichy</h1>
                                <p class="text-sm text-gray-500">Mentoring Portal</p>
                            </div>
                        </div>
                        
                        <!-- Right: Quick Info -->
                        <div class="hidden md:flex items-center gap-4">
                            <div class="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <p class="text-xs text-gray-500">Current Date</p>
                                <p class="text-sm font-semibold text-gray-900">{{ new Date().toLocaleDateString('en-GB') }}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Main Content Area -->
                <section class="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
                    <slot />
                </section>
            </main>
        </section>
        <UiFooter class="w-full" />
    </div>
</template>
<script setup lang="ts">
const route = useRoute()
useHead({
    title: `${route.meta.title || `Mentoring`}`
})
</script>