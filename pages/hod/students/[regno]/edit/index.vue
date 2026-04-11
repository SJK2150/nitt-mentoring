<template>
  <div class="min-h-screen bg-nitMaroon-50 p-8 relative">
    <MiscGeometricBg />
    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Edit Student</h1>
          <p class="text-gray-600 mt-2">{{ mentee?.name }}</p>
        </div>
        <NuxtLink 
          :to="`/hod/students`"
          class="px-6 py-3 bg-gray-500 text-white font-semibold rounded shadow-sm hover:shadow hover:bg-gray-600 transition-all duration-300">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </span>
        </NuxtLink>
      </div>

      <div v-if="loading" class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300 text-center animate-slide-up">
        <div class="flex items-center justify-center gap-3">
          <div class="w-6 h-6 border-4 border-nitMaroon-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-600 font-medium">Loading student information...</p>
        </div>
      </div>

      <div v-else-if="mentee" class="animate-slide-up">
        <!-- Basic Information Card -->
        <div class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <form @submit.prevent="updateBasicInfo" class="flex flex-col gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
            <input 
              v-model="basicForm.register_number" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              v-model="basicForm.name" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select v-model="basicForm.year" class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" required>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input 
              v-model="basicForm.section" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <input 
              v-model="basicForm.batch" 
              type="number" 
              class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select v-model="basicForm.department_id" class="w-full px-4 py-3 border border-gray-300 rounded bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" required>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <button 
            type="submit" 
            class="bg-nitMaroon-600 text-white py-3 px-4 rounded shadow-sm hover:shadow hover:bg-nitMaroon-700 transition-all font-semibold"
            :disabled="updating"
          >
            {{ updating ? 'Updating...' : 'Update Basic Info' }}
          </button>
        </form>
        </div>
      </div>

      <div v-else class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300 text-center animate-slide-up">
        <p class="text-red-500 font-semibold text-lg">{{ loadError || 'Student not found' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartialStudent, Department } from '@/types/types';

definePageMeta({
  title: "Edit Student",
  middleware: ["level2"]
})

const route = useRoute()
const regno = route.params.regno as string

const mentee = ref<PartialStudent | null>(null)
const departments = ref<Department[]>([])
const loading = ref(true)
const updating = ref(false)
const loadError = ref('')

// Form data
const basicForm = ref({
  register_number: '',
  name: '',
  year: 'UG',
  section: '',
  batch: 0,
  department_id: ''
})

// Fetch student data
onMounted(async () => {
  try {
    const [studentData, deptData] = await Promise.all([
      $fetch(`/api/mentees/${regno}`),
      $fetch('/api/dept')
    ]) as [PartialStudent, Department[]]

    mentee.value = studentData
    departments.value = deptData

    // Populate form
    basicForm.value = {
      register_number: studentData.register_number,
      name: studentData.name,
      year: studentData.year,
      section: studentData.section || '',
      batch: studentData.batch || 0,
      department_id: studentData.department?.id || ''
    }
  } catch (error: any) {
    console.error('Error fetching student data:', error)
    const status = error?.status || error?.statusCode
    if (status === 404) {
      loadError.value = 'Student not found'
    } else if (status === 401) {
      loadError.value = 'Session expired. Please login again.'
    } else {
      loadError.value = 'Unable to load student details right now.'
    }
  } finally {
    loading.value = false
  }
})

async function updateBasicInfo() {
  updating.value = true
  try {
    await $fetch(`/api/mentees/update/${regno}/basic`, {
      method: 'PATCH',
      body: {
        name: basicForm.value.name,
        year: basicForm.value.year,
        section: basicForm.value.section,
        batch: basicForm.value.batch,
        department_id: basicForm.value.department_id
      }
    })
    
    alert('Basic information updated successfully!')
  } catch (error: any) {
    console.error('Error updating basic info:', error)
    alert(error?.data?.statusText || error?.data?.statusMessage || 'Failed to update basic information')
  } finally {
    updating.value = false
  }
}
</script> 