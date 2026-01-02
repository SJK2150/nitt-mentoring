<template>
  <div class="min-h-screen bg-nitMaroon-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Filter Section -->
      <div class="flex justify-end mb-6">
        <button
          @click="expandFilter = !expandFilter"
          class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded-lg transition-all duration-300">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {{ expandFilter ? 'Hide' : 'Show' }} Filters
          </span>
        </button>
      </div>
      
      <!-- Filter Inputs -->
      <div
        :class="[expandFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0', 'overflow-hidden transition-all duration-500 ease-in-out mb-6']">
        <div class="bg-white rounded-lg border border-nitMaroon-200 p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              v-model="batch"
              class="px-4 py-3 rounded-lg border border-nitMaroon-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
              placeholder="Filter by Batch"
            />
            <input
              type="text"
              v-model="mentorName"
              class="px-4 py-3 rounded-lg border border-nitMaroon-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
              placeholder="Filter by Mentor"
            />
            <input
              type="text"
              v-model="classSection"
              class="px-4 py-3 rounded-lg border border-nitMaroon-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
              placeholder="Filter by Section"
            />
            <input
              type="text"
              v-model="name"
              class="px-4 py-3 rounded-lg border border-nitMaroon-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
              placeholder="Filter by Name"
            />
            <input
              type="text"
              v-model="regNo"
              class="px-4 py-3 rounded-lg border border-nitMaroon-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
              placeholder="Filter by Reg No"
            />
          </div>
        </div>
      </div>
  
      <!-- Students Table -->
      <div class="bg-white rounded-lg overflow-hidden border border-nitMaroon-200 animate-slide-up">
        <table class="table-auto border-collapse w-full">
          <thead class="bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white">
            <tr>
              <th class="px-4 py-4 text-left font-semibold">Reg #</th>
              <th class="px-4 py-4 text-left font-semibold">Name</th>
              <th class="px-4 py-4 text-left font-semibold">Course</th>
              <th class="px-4 py-4 text-left font-semibold">Section</th>
              <th class="px-4 py-4 text-left font-semibold">Batch</th>
              <th v-if="props.mentees[0]?.mentor" class="px-4 py-4 text-left font-semibold">Mentor</th>
              <th class="px-4 py-4 text-left font-semibold">Meetings</th>
              <th class="px-4 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="mentee in computedMentees"
              :key="mentee.register_number"
              class="text-sm border-t border-nitMaroon-200 hover:bg-nitMaroon-50 transition-colors"
            >
              <td class="px-4 py-4 font-medium">{{ mentee.register_number }}</td>
              <td class="px-4 py-4">{{ mentee.name }}</td>
              <td class="px-4 py-4">{{ mentee.year }}</td>
              <td class="px-4 py-4">{{ mentee.section }}</td>
              <td class="px-4 py-4">{{ mentee.batch }}</td>
              <td v-if="mentee.mentor" class="px-4 py-4 text-gray-600">{{ mentee.mentor.name }}</td>
              <td class="px-4 py-4">
                <a :href="`/dashboard/mentees/${mentee.register_number}`" 
                  class="text-nitMaroon-600 hover:text-nitMaroon-700 font-semibold hover:underline flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View
                </a>
              </td>
              <td class="px-4 py-4">
                <div class="flex gap-2">
                  <button
                    @click="editMentee(mentee)"
                    class="px-4 py-2 bg-nitMaroon-600 text-white font-medium rounded-lg hover:bg-nitMaroon-700 transition-colors">
                    Edit
                  </button>
                  <button
                    @click="deleteMentee(mentee)"
                    class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!computedMentees.length" class="bg-white rounded-lg p-12 border border-nitMaroon-200 text-center mt-6 animate-slide-up">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-gray-600 font-medium">No students found matching filters</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { PartialStudent } from "@/types/types.js";

const props = defineProps<{ mentees: PartialStudent[] }>()
const emit = defineEmits(['deleted', 'edit'])

const mentorName = ref("")
const name = ref("")
const regNo = ref("")
const batch = ref("")
const classSection = ref("")
const expandFilter = ref(false)

const computedMentees = computed(() => {
  if (!expandFilter.value) return props.mentees
  
  return props.mentees.filter(mentee => {
    return (
      (mentorName.value ? mentee.mentor?.name?.toLowerCase().includes(mentorName.value.toLowerCase()) : true) &&
      (batch.value ? mentee.batch.toString().includes(batch.value) : true) &&
      (classSection.value ? mentee.section.toLowerCase() === classSection.value.toLowerCase() : true) &&
      (name.value ? mentee.name.toLowerCase().includes(name.value.toLowerCase()) : true) &&
      (regNo.value ? mentee.register_number.includes(regNo.value) : true)
    )
  })
})

async function editMentee(mentee: PartialStudent) {
  const auth = useCookie<string>("nitt_token")
  if (!auth.value) return

  try {
    // Navigate directly to the edit page
    console.log(mentee);
    await navigateTo(`/hod/students/${mentee.register_number}/edit`)
  } catch (err) {
    console.error(err)
    alert("An error occurred while navigating to edit page.")
  }
}

async function deleteMentee(mentee: PartialStudent) {
  const auth = useCookie<string>("nitt_token")
  if (!auth.value) return

  if (!confirm(`Are you sure you want to delete ${mentee.name} (${mentee.register_number})?`)) {
    return
  }

  try {
    // Delete using the users delete endpoint which handles cascading deletions
    const { error } = await useFetch(`/api/users/delete/${mentee.register_number}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.value}`,
      }
    })

    if (error.value) {
      console.error("Delete failed", error.value)
      alert("Failed to delete student. Please try again.")
    } else {
      emit('deleted', mentee.register_number)
      alert("Student deleted successfully!")
    }
  } catch (err) {
    console.error(err)
    alert("An error occurred while deleting the student.")
  }
}
</script>