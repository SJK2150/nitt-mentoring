<template>
    <div class="bg-white rounded-lg border border-nitMaroon-200 overflow-hidden shadow-sm">
        <!-- Header Banner -->
        <div class="h-24 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 relative">
            <div class="absolute -bottom-10 left-6">
                <div class="w-20 h-20 rounded-xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                    {{ mentee.name.charAt(0).toUpperCase() }}
                </div>
            </div>
        </div>
        
        <!-- Content -->
        <div class="pt-14 px-6 pb-6">
            <!-- Name and Badge -->
            <div class="flex items-start justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ mentee.name }}</h1>
                    <p class="text-sm text-gray-600 mt-1">Student Information</p>
                </div>
                <span class="px-3 py-1 bg-nitMaroon-100 text-nitMaroon-700 text-sm font-semibold rounded-full">
                    {{ mentee.year }}
                </span>
            </div>
            
            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Reg Number -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-nitMaroon-50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration No.</p>
                        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ mentee.register_number }}</p>
                    </div>
                </div>
                
                <!-- Batch -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-nitMaroon-50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Batch</p>
                        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ mentee.batch || 'N/A' }}</p>
                    </div>
                </div>
                
                <!-- Section -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-nitMaroon-50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Section</p>
                        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ mentee.section || 'N/A' }}</p>
                    </div>
                </div>
                
                <!-- Mentor -->
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-nitMaroon-50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Mentor</p>
                        <p class="text-sm font-semibold text-gray-900 mt-0.5 truncate">{{ mentee.mentor?.name || 'Not Assigned' }}</p>
                    </div>
                </div>
                
                <!-- Department (if available) -->
                <div v-if="mentee.department" class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-nitMaroon-50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</p>
                        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ mentee.department?.name || 'N/A' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { PartialStudent, Student, User } from '@/types/types.js';
const { mentee } = defineProps<{
    mentee: PartialStudent
}>()
</script>