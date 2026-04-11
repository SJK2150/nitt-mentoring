<template>
    <div class="min-h-screen bg-nitMaroon-50 p-6 relative">
        <MiscGeometricBg />
        <div class="max-w-7xl mx-auto relative z-10">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">All Students</h1>
                <p class="text-gray-600 mt-1">Manage student records and assignments</p>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-lg border border-nitMaroon-200 p-1 mb-6 inline-flex gap-1">
                <button
                    @click="activeTab = 'all'"
                    :class="[
                        'px-4 py-2 rounded text-sm font-medium transition-all duration-200 border-2 border-dashed',
                        activeTab === 'all' 
                            ? 'bg-nitMaroon-600 text-white shadow-sm border-nitMaroon-400' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-300'
                    ]">
                    All Students
                    <span class="ml-1.5 text-xs opacity-75">({{ mentees.length }})</span>
                </button>
                <button
                    @click="activeTab = 'UG'"
                    :class="[
                        'px-4 py-2 rounded text-sm font-medium transition-all duration-200 border-2 border-dashed',
                        activeTab === 'UG' 
                            ? 'bg-nitMaroon-600 text-white shadow-sm border-nitMaroon-400' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-300'
                    ]">
                    UG Students
                    <span class="ml-1.5 text-xs opacity-75">({{ ugCount }})</span>
                </button>
                <button
                    @click="activeTab = 'PG'"
                    :class="[
                        'px-4 py-2 rounded text-sm font-medium transition-all duration-200 border-2 border-dashed',
                        activeTab === 'PG' 
                            ? 'bg-nitMaroon-600 text-white shadow-sm border-nitMaroon-400' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-300'
                    ]">
                    PG Students
                    <span class="ml-1.5 text-xs opacity-75">({{ pgCount }})</span>
                </button>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white rounded-lg border border-nitMaroon-200 p-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="relative flex-1 max-w-md">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            v-model="search"
                            class="w-full pl-10 pr-3 py-2 bg-nitMaroon-50 border border-nitMaroon-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                            placeholder="Search by name or roll number..." 
                        />
                    </div>
                    <div v-if="search" class="text-xs text-gray-600 whitespace-nowrap">
                        {{ filteredMentees.length }} results
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-lg border border-nitMaroon-200 p-12 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nitMaroon-50 mb-4">
                    <div class="w-8 h-8 border-3 border-gray-300 border-t-nitMaroon-600 rounded-full animate-spin"></div>
                </div>
                <p class="text-gray-600 font-medium">Loading students...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-white rounded-lg border border-red-200 p-12 text-center">
                <p class="text-red-600 font-medium">Unable to load students. Please refresh and try again.</p>
            </div>

            <!-- Students Grid -->
            <div v-else-if="mentees.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="(student, index) in filteredMentees" :key="student.register_number"
                    @click="openStudentEdit(student.register_number)"
                    @keydown.enter="openStudentEdit(student.register_number)"
                    @keydown.space.prevent="openStudentEdit(student.register_number)"
                    tabindex="0"
                    role="button"
                    class="group relative bg-white rounded-lg overflow-hidden border border-nitMaroon-200 hover:border-nitMaroon-300 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:ring-offset-2">
                    
                    <!-- Header Section (Colored Banner) -->
                    <div class="h-16 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 relative"></div>
                    
                    <!-- Body Section -->
                    <div class="relative px-4 pt-0 pb-4">
                        <!-- Avatar overlapping header -->
                        <div class="absolute -top-10 left-4">
                            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-700 flex items-center justify-center text-white font-bold text-lg shadow-md border-4 border-white">
                                {{ student.name.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                        
                        <!-- Title and Badge -->
                        <div class="pt-6 mb-2">
                            <div class="flex items-start justify-between gap-2 mb-1">
                                <h3 class="font-semibold text-sm text-gray-900 flex-1 line-clamp-1">{{ student.name }}</h3>
                                <span class="px-2 py-0.5 bg-nitMaroon-100 text-nitMaroon-700 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                                    {{ student.year }}
                                </span>
                            </div>
                            <p class="text-xs text-gray-600 line-clamp-1">Roll: {{ student.register_number }}</p>
                        </div>
                        
                        <!-- Info Grid -->
                        <div class="space-y-1 mb-3">
                            <div class="flex items-center text-xs">
                                <span class="text-gray-500 w-16">Section:</span>
                                <span class="text-gray-900 font-medium">{{ student.year === 'UG' ? (student.section || 'N/A') : 'N/A' }}</span>
                            </div>
                            <div class="flex items-center text-xs">
                                <span class="text-gray-500 w-16">Batch:</span>
                                <span class="text-gray-900 font-medium">{{ student.year === 'UG' ? student.batch : 'N/A' }}</span>
                            </div>
                            <div v-if="student.mentor" class="flex items-center text-xs">
                                <span class="text-gray-500 w-16">Mentor:</span>
                                <span class="text-gray-900 font-medium line-clamp-1">{{ student.mentor.name }}</span>
                            </div>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex justify-end">
                            <button
                                @click.stop="deleteStudent(student)"
                                class="w-10 h-8 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-300 flex items-center justify-center">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!filteredMentees.length" class="bg-white rounded-lg border border-nitMaroon-200 p-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p class="text-gray-600 font-medium">{{ search ? `No students found matching "${search}"` : 'No students available.' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PartialStudent } from '@/types/types';

definePageMeta({
    title: "All Students",
    middleware: ["level2"]
})

const search = ref("")
const activeTab = ref<'all' | 'UG' | 'PG'>('all')

// Server-side data fetching
const { data: studentsData, pending, error } = await useFetch('/api/mentees/all', {
    key: 'hod-students-list'
})

const loading = computed(() => pending.value)

const mentees = computed(() => {
    if (!studentsData.value) return []
    return studentsData.value.map(mentee => ({
        register_number: mentee.register_number,
        name: mentee.name,
        year: mentee.year,
        section: mentee.section,
        batch: mentee.year === 'UG' ? (typeof mentee.batch === 'number' ? mentee.batch : Number(mentee.batch) || 0) : null,
        department: mentee.department || { name: 'Unknown', id: 'unknown' },
        mentor_id: mentee.mentor_id,
        mentor: mentee.mentor || undefined,
        is_pg: typeof mentee.is_pg === 'boolean' ? mentee.is_pg : false
    }))
})

// Count students by type
const ugCount = computed(() => mentees.value.filter(s => s.year === 'UG').length)
const pgCount = computed(() => mentees.value.filter(s => s.year === 'PG').length)

// Filtered students based on tab and search
const filteredMentees = computed(() => {
    let filtered = mentees.value
    
    // Filter by tab
    if (activeTab.value === 'UG') {
        filtered = filtered.filter(s => s.year === 'UG')
    } else if (activeTab.value === 'PG') {
        filtered = filtered.filter(s => s.year === 'PG')
    }
    
    // Filter by search
    if (search.value) {
        const searchLower = search.value.toLowerCase()
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(searchLower) ||
            student.register_number.toLowerCase().includes(searchLower)
        )
    }
    
    return filtered
})

const openStudentEdit = async (regno: string) => {
    await navigateTo(`/hod/students/${regno}/edit`)
}

// Delete student
async function deleteStudent(student: PartialStudent) {
    if (!confirm(`Are you sure you want to delete ${student.name} (${student.register_number})?`)) {
        return
    }

    try {
        const { error } = await useFetch(`/api/mentees/delete/${student.register_number}`, {
            method: "DELETE"
        })

        if (error.value) {
            alert("Failed to delete student. Please try again.")
        } else {
            // Remove from local data
            if (studentsData.value) {
                studentsData.value = studentsData.value.filter(
                    m => m.register_number !== student.register_number
                )
            }
            alert("Student deleted successfully!")
        }
    } catch (err) {
        console.error(err)
        alert("An error occurred while deleting the student.")
    }
}
</script>