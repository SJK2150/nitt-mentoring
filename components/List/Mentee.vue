<template>
    <div class="lg:px-4 mx-auto w-full flex flex-col gap-4 items-start lg:items-center">
      <!-- Filter Section -->
      <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
        <div class="flex flex-col items-end gap-4">
          <button
            class="bg-nitMaroon-600 text-white rounded-md p-2"
            @click="expandFilter = !expandFilter"
          >
            Filter {{ expandFilter ? "-" : "+" }}
          </button>
          <div
            :class="expandFilter ? 'max-h-[90rem]' : 'max-h-0'"
            class="flex flex-col lg:flex-row gap-2 overflow-y-hidden transition-all duration-500 ease-in-out"
          >
            <input
              type="text"
              v-model="batch"
              class="w-48 lg:w-56 p-2 rounded-md border border-nitMaroon-600 bg-nitMaroon-50"
              placeholder="Batch"
            />
            <input
              type="text"
              v-model="mentorName"
              class="w-48 lg:w-56 p-2 rounded-md border border-nitMaroon-600 bg-nitMaroon-50"
              placeholder="Mentor"
            />
            <input
              type="text"
              v-model="classSection"
              class="w-48 lg:w-56 p-2 rounded-md border border-nitMaroon-600 bg-nitMaroon-50"
              placeholder="Section"
            />
            <input
              type="text"
              v-model="name"
              class="w-48 lg:w-56 p-2 rounded-md border border-nitMaroon-600 bg-nitMaroon-50"
              placeholder="Name"
            />
            <input
              type="text"
              v-model="regNo"
              class="w-48 lg:w-56 p-2 rounded-md border border-nitMaroon-600 bg-nitMaroon-50"
              placeholder="Reg No"
            />
          </div>
        </div>
      </div>
  
      <!-- Students Table -->
      <table class="table-auto border-collapse w-full max-w-sm lg:max-w-full">
        <thead class="bg-nitMaroon-600 text-white text-xs lg:text-base">
          <tr>
            <th>Reg #</th>
            <th>Name</th>
            <th>Course</th>
            <th>Section</th>
            <th>Batch</th>
            <th v-if="props.mentees[0]?.mentor">Mentor</th>
            <th>Meetings</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mentee in computedMentees"
            :key="mentee.register_number"
            class="text-xs lg:text-base text-center odd:bg-nitMaroon-100 even:bg-zinc-100 border-t border-nitMaroon-100"
          >
            <td>{{ mentee.register_number }}</td>
            <td>{{ mentee.name }}</td>
            <td>{{ mentee.year }}</td>
            <td>{{ mentee.section }}</td>
            <td>{{ mentee.batch }}</td>
            <td v-if="mentee.mentor">{{ mentee.mentor.name }}</td>
            <td>
              <a :href="`/dashboard/mentees/${mentee.register_number}`">
                <span class="sr-only">Check Meeting Details</span>
                <svg
                  class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </a>
            </td>
            <td>
              <div class="flex gap-2 justify-center">
                <button
                  class="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition-colors"
                  @click="editMentee(mentee)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition-colors"
                  @click="deleteMentee(mentee)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!computedMentees.length" class="text-red-500 font-medium">
        No mentees found matching filters
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