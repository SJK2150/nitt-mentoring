<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">All Students</h1>
                <p class="text-gray-600 mt-1">Manage student records and assignments</p>
            </div>
            <ListMentee v-if="mentees.length" :mentees="mentees" @deleted="handleDeleted" />
            <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <div class="w-6 h-6 border-2 border-gray-400 border-t-nitMaroon-600 rounded-full animate-spin"></div>
                </div>
                <p class="text-gray-600">Loading students...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PartialStudent, Department, FacultyInfo } from '@/types/types';

definePageMeta({
    title: "All Students",
    middleware: ["level1"]
})

const auth = useCookie<string>("nitt_token")

// Server-side data fetching - more reliable
const { data: studentsData } = await useFetch('/api/mentees/all', {
    headers: { "Authorization": `Bearer ${auth.value}` },
    key: 'hod-students-list'
})

const mentees = computed(() => {
    if (!studentsData.value) return []
    return studentsData.value.map(mentee => ({
        register_number: mentee.register_number,
        name: mentee.name,
        year: mentee.year,
        section: mentee.section,
        batch: typeof mentee.batch === 'number' ? mentee.batch : Number(mentee.batch) || 0,
        department: mentee.department || { name: 'Unknown', id: 'unknown' },
        mentor_id: mentee.mentor_id,
        mentor: mentee.mentor || undefined,
        is_pg: typeof mentee.is_pg === 'boolean' ? mentee.is_pg : false
    }))
})

// Handle deletion from child
function handleDeleted(register_number: string) {
    // Remove from the data source
    if (studentsData.value) {
        studentsData.value = studentsData.value.filter(
            m => m.register_number !== register_number
        )
    }
}
</script>