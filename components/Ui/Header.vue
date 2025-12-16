<template>
    <header class="fixed top-0 left-0 h-screen z-50">
        <nav class="h-full bg-gradient-to-b from-nitMaroon-700 via-nitMaroon-650 to-nitMaroon-700 shadow-2xl transition-all duration-300"
            :class="navState ? 'w-64' : 'w-20'">
            <div class="flex flex-col h-full">
                <!-- Header with Logo and Toggle -->
                <div class="p-4 flex items-center justify-between border-b border-white/10">
                    <div v-if="navState" class="flex items-center gap-3 overflow-hidden transition-all duration-300">
                        <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span class="text-white font-semibold text-sm">Mentoring</span>
                    </div>
                    <button 
                        @click="navState = !navState"
                        class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
                        :class="!navState && 'mx-auto'">
                        <svg class="w-5 h-5 text-white transition-transform duration-300" :class="navState && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <!-- Navigation Links -->
                <div v-if="userStore.loggedIn" class="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    <a v-for="route in MainMenu.filter(x => x.level <= userStore.level && (userStore.level === 3 ? x.level === 3 : true) &&(x.key=='mentees'?userStore.level==1:true))" 
                        :href="route.action"
                        :key="route.key"
                        :title="route.toolTip"
                        class="group flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 relative overflow-hidden">
                        <!-- Hover effect background -->
                        <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <!-- Icon -->
                        <div class="relative z-10 w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="route.routeIcon" />
                            </svg>
                        </div>
                        
                        <!-- Label -->
                        <span v-if="navState" class="relative z-10 font-medium text-sm transition-all duration-200 capitalize">
                            {{ route.name }}
                        </span>
                        
                        <!-- Active indicator -->
                        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </a>
                </div>

                <!-- Footer with User Info and Logout -->
                <div class="p-4 border-t border-white/10 space-y-2">
                    <!-- User Info (if expanded) -->
                    <div v-if="navState && userStore.loggedIn" class="px-3 py-2 mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <span class="text-white font-semibold text-sm">{{ userStore.username?.charAt(0).toUpperCase() }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-white text-sm font-medium truncate">{{ userStore.username }}</p>
                                <p class="text-white/60 text-xs">{{ ['Student', 'Faculty', 'HOD', 'Admin'][userStore.level] }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Logout Button -->
                    <button 
                        v-if="userStore.loggedIn"
                        @click="signOut"
                        :title="navState ? '' : 'Logout'"
                        class="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div class="relative z-10 w-10 h-10 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="AllIcons.logout" />
                            </svg>
                        </div>
                        
                        <span v-if="navState" class="relative z-10 font-medium text-sm">Sign Out</span>
                    </button>

                    <!-- Login Button (if not logged in) -->
                    <a 
                        v-else
                        href="/login"
                        :title="navState ? '' : 'Login'"
                        class="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div class="relative z-10 w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="AllIcons.login" />
                            </svg>
                        </div>
                        
                        <span v-if="navState" class="relative z-10 font-medium text-sm">Sign In</span>
                    </a>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
const navState = ref(true)
const route = useRoute()
const userStore = useUserStore()
const auth = useCookie<string>("nitt_token")
const signOut = () => {
    auth.value = ""
    userStore.signOut()
    navigateTo("/login")
}
</script>