<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-nitMaroon-50 to-gray-100 p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-900 mb-2 tracking-tight">User Management</h1>
                <p class="text-gray-600 text-lg">Manage faculty and student accounts</p>
            </div>
            
            <!-- Tab Navigation with Modern Design -->
            <div class="mb-8 animate-slide-up">
                <div class="flex flex-wrap gap-2">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab"
                        @click="activeTab = tab"
                        :class="[
                            'relative px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 group overflow-hidden',
                            activeTab === tab 
                                ? 'bg-nitMaroon-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-nitMaroon-400'
                        ]"
                    >
                        <!-- Animated background on active -->
                        <span v-if="activeTab === tab" class="absolute inset-0 bg-gradient-to-r from-nitMaroon-500 to-nitMaroon-700 opacity-10"></span>
                        
                        <!-- Tab label -->
                        <span class="relative z-10 flex items-center gap-1.5">
                            <!-- Icon based on tab -->
                            <svg v-if="tab === 'Faculty'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <svg v-else-if="tab === 'UG Students'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {{ tab }}
                        </span>
                        
                        <!-- Count badge -->
                        <span v-if="activeTab === tab" class="absolute -top-2 -right-2 w-5 h-5 bg-white text-nitMaroon-600 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                            {{ displayedUsers?.length || 0 }}
                        </span>
                    </button>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <!-- Search Bar -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-slide-up" style="animation-delay: 0.1s;">
                    <div class="flex items-center gap-3">
                        <div class="relative flex-1 max-w-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                v-model="search"
                                class="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                                placeholder="Search by name or ID..." 
                            />
                        </div>
                        <div v-if="search" class="text-xs text-gray-600 whitespace-nowrap">
                            {{ displayedUsers?.length || 0 }} results
                        </div>
                    </div>
                </div>
                
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                        <div class="w-16 h-16 border-4 border-nitMaroon-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p class="mt-6 text-gray-600 font-medium">Loading users...</p>
                </div>
                
                <!-- Faculty Tab -->
                <div v-else-if="activeTab === 'Faculty' && displayedUsers"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                    <div v-for="(user, index) in displayedUsers" :key="user.id"
                        class="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 animate-scale-in"
                        :style="`animation-delay: ${index * 0.05}s`">
                        
                        <!-- Header Section (Colored Banner) -->
                        <div class="h-16 bg-gradient-to-r from-nitMaroon-500 to-nitMaroon-700 relative group-hover:shadow-md transition-all duration-300"></div>
                        
                        <!-- Body Section -->
                        <div class="relative px-4 pt-0 pb-4">
                            <!-- Avatar overlapping header -->
                            <div class="absolute -top-10 left-4">
                                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-nitMaroon-500 to-nitMaroon-700 flex items-center justify-center text-white font-bold text-lg shadow-md border-4 border-white">
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            
                            <!-- Title and Badge -->
                            <div class="pt-6 mb-2">
                                <div class="flex items-start justify-between gap-2 mb-1">
                                    <h3 class="font-semibold text-sm text-gray-900 flex-1 line-clamp-1">{{ user.name }}</h3>
                                    <span class="px-2 py-0.5 bg-nitMaroon-100 text-nitMaroon-700 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">Faculty</span>
                                </div>
                                <p class="text-xs text-gray-600 line-clamp-1">{{ user.department }}</p>
                            </div>
                            
                            <!-- Description/Info -->
                            <p class="text-xs text-gray-500 mb-3 line-clamp-1">ID: {{ user.id }}</p>
                            
                            <!-- Footer Section (Action) -->
                            <button @click="setUser(user.username)" 
                                class="w-1/2 py-1.5 px-3 bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white rounded text-xs font-medium transition-colors duration-300 flex items-center justify-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                <!-- UG/PG Students Tab -->
                <div v-else-if="(activeTab === 'UG Students' || activeTab === 'PG Students') && displayedUsers"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                    <div v-for="(user, index) in displayedUsers" :key="user.id"
                        class="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 animate-scale-in"
                        :style="`animation-delay: ${index * 0.05}s`">
                        
                        <!-- Header Section (Colored Banner) -->
                        <div class="h-16 bg-gradient-to-r from-nitMaroon-500 to-nitMaroon-700 relative group-hover:shadow-md transition-all duration-300"></div>
                        
                        <!-- Body Section -->
                        <div class="relative px-4 pt-0 pb-4">
                            <!-- Avatar overlapping header -->
                            <div class="absolute -top-10 left-4">
                                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-nitMaroon-500 to-nitMaroon-700 flex items-center justify-center text-white font-bold text-lg shadow-md border-4 border-white">
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            
                            <!-- Title and Badge -->
                            <div class="pt-6 mb-2">
                                <div class="flex items-start justify-between gap-2 mb-1">
                                    <h3 class="font-semibold text-sm text-gray-900 flex-1 line-clamp-1">{{ user.name }}</h3>
                                    <span class="px-2 py-0.5 bg-nitMaroon-100 text-nitMaroon-700 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">{{ user.year }}</span>
                                </div>
                                <p class="text-xs text-gray-600 line-clamp-1">Roll: {{ user.register_no }}</p>
                            </div>
                            
                            <!-- Description/Info -->
                            <p class="text-xs text-gray-500 mb-3 line-clamp-1">Sec: {{ user.section || 'N/A' }} | Batch: {{ user.batch || 'N/A' }}</p>
                            
                            <!-- Footer Section (Action) -->
                            <button @click="setUser(user.username)" 
                                class="w-1/2 py-1.5 px-3 bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white rounded text-xs font-medium transition-colors duration-300 flex items-center justify-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Password Edit Modal -->
                <div
                    :class="`${modelOpen ? `visible opacity-100` : `invisible opacity-0`} transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center p-4`">
                    <div :class="`${modelOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-lg p-8 relative`">
                        <!-- Close Button -->
                        <button 
                            @click="modelOpen = false"
                            class="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group">
                            <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <!-- Modal Header -->
                        <div class="mb-8">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-nitMaroon-500 to-nitMaroon-700 flex items-center justify-center mb-4 shadow-lg">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-900">Change Password</h2>
                            <p class="text-gray-600 mt-1">Updating password for <span class="font-semibold text-nitMaroon-700">{{ currentUser }}</span></p>
                        </div>
                        
                        <!-- Form -->
                        <form @submit="handleSubmit" class="space-y-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        v-model="newPass"
                                        placeholder="Enter new password"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:border-transparent transition-all duration-300 text-gray-900"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        v-model="confirmPass"
                                        placeholder="Confirm new password"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nitMaroon-500 focus:border-transparent transition-all duration-300 text-gray-900"
                                    />
                                </div>
                            </div>
                            
                            <MiscMessage
                                v-if="message.text"
                                :class="`transition-all duration-300`"
                                :type="message.type">
                                {{ message.text }}
                            </MiscMessage>
                            
                            <button 
                                type="submit"
                                class="w-full py-3.5 px-6 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white rounded-xl font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
                
                <!-- Modal Backdrop -->
                <div
                    @click="modelOpen = false"
                    :class="`${modelOpen ? `visible opacity-100` : `invisible opacity-0`} transition-opacity duration-300 fixed inset-0 bg-black/60 backdrop-blur-md z-40`">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: [
        "level3"
    ]
})

const tabs = ['Faculty', 'UG Students', 'PG Students']
const activeTab = ref('Faculty')

const modelOpen = ref(false);
const currentUser = ref("")
const userStore = useUserStore()

const newPass = ref("")
const confirmPass = ref("")

// Server-side data fetching - more reliable
const auth = useCookie<string>("nitt_token")

const { data: facultyData, refresh: refreshFaculty } = await useFetch('/api/faculty/all', {
    headers: { "Authorization": `Bearer ${auth.value}` },
    key: 'faculty-list'
})

const { data: studentsData, refresh: refreshStudents } = await useFetch('/api/mentees/all', {
    headers: { "Authorization": `Bearer ${auth.value}` },
    key: 'students-list'
})

const facultyUsers = computed(() => facultyData.value || [])
const ugStudents = computed(() => (studentsData.value || []).filter((s: any) => s.year === 'UG'))
const pgStudents = computed(() => (studentsData.value || []).filter((s: any) => s.year === 'PG'))

const search = ref("")
const expandFilter = ref(false)

const displayedUsers = computed(() => {
    let users: any[] = []
    
    if (activeTab.value === 'Faculty') {
        users = facultyUsers.value
    } else if (activeTab.value === 'UG Students') {
        users = ugStudents.value
    } else if (activeTab.value === 'PG Students') {
        users = pgStudents.value
    }
    
    if (!expandFilter.value || !search.value) return users
    
    return users.filter(user => {
        const searchLower = search.value.toLowerCase()
        if (activeTab.value === 'Faculty') {
            return user.name?.toLowerCase().includes(searchLower) ||
                   String(user.id).includes(search.value)
        } else {
            return user.name?.toLowerCase().includes(searchLower) ||
                   user.register_no?.toLowerCase().includes(searchLower)
        }
    })
})

const setUser = (username: string) => {
    currentUser.value = username;
    modelOpen.value = true;
}

const message = ref({ type: "error", text: "" })
const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const password = newPass.value;
    if (password !== confirmPass.value) {
        message.value.type = "error"
        message.value.text = "Passwords do not match"
        return;
    }
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch(`/api/users/edit`, {
        method: "PATCH", body: JSON.stringify({ username: currentUser.value, password }),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Updated user."
            newPass.value = "";
            confirmPass.value = "";
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "You are not supposed to be here."
                    break;
                case 404:
                    message.value.text = "No such user exists."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()
        }
    })
};
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
}

.animate-scale-in {
    animation: scale-in 0.5s ease-out forwards;
    opacity: 0;
}
</style>