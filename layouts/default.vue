<template>
    <div class="tracking-wide flex flex-col items-center min-h-screen">
        <section class="flex w-full min-h-screen">
            <UiHeader />

            <main class="flex-1 flex flex-col transition-all duration-300 ml-20">
                <!-- Top Navigation Bar - Material 3 Style -->
                <section class="w-full bg-nitMaroon-50 border-b border-nitMaroon-200 sticky top-0 z-40">
                    <div class="flex items-center justify-between px-8 py-3">
                        <!-- Left: Logo and Title -->
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-lg bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center">
                                <img src="/nitt_logo_min.webp" class="w-7 h-7" />
                            </div>
                            <div>
                                <h1 class="text-lg font-bold text-nitMaroon-900">NIT Trichy</h1>
                                <p class="text-xs text-nitMaroon-700">Mentoring Portal</p>
                            </div>
                        </div>
                        
                        <!-- Right: Quick Info -->
                        <div class="hidden md:flex items-center gap-4">
                            <div class="px-4 py-2 bg-white rounded-lg border border-nitMaroon-200">
                                <p class="text-xs text-nitMaroon-700 font-medium">Current Date</p>
                                <p class="text-sm font-semibold text-nitMaroon-900">{{ new Date().toLocaleDateString('en-GB') }}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Main Content Area - Material 3 Background -->
                <section class="flex-1 bg-nitMaroon-50">
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