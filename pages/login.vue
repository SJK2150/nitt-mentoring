<template>
    <div class="h-screen overflow-hidden bg-nitMaroon-50 flex items-start justify-center pt-12 px-6 relative">
        <MiscGeometricBg />
        <div class="w-full max-w-md relative z-10">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-nitMaroon-600 rounded-xl mb-4">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">NITT Mentoring Portal</h1>
                <p class="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <!-- Login Form -->
            <div class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-8">
                <form @submit="handleSubmit" class="space-y-5">
                    <div>
                        <label for="username_field" class="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input 
                            name="username" 
                            id="username_field" 
                            type="text" 
                            placeholder="Enter your username"
                            class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label for="password_field" class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            name="password" 
                            id="password_field" 
                            type="password" 
                            placeholder="Enter your password"
                            class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        />
                    </div>

                    <MiscMessage 
                        v-if="message.text"
                        class="transition-all duration-300"
                        :type="message.type">
                        {{ message.text }}
                    </MiscMessage>

                    <div class="flex items-center justify-end">
                        <router-link 
                            to="/forgot-password" 
                            class="text-sm text-nitMaroon-600 hover:text-nitMaroon-700 font-medium">
                            Forgot password?
                        </router-link>
                    </div>

                    <button 
                        type="submit"
                        class="bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white py-3 px-4 rounded font-medium transition-colors duration-200 shadow-sm">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

// If the user was redirected via middleware
let redirect = route.query.redirect as string;
// Else
if (!redirect) redirect = "/dashboard"

const message = ref({ type: "error", text: "" })
//If there was an error during login 
let loginerr = route.query.loginerr as string;
if(loginerr){
    message.value.type="error"
    if(loginerr=='missing'){
        message.value.text = "Missing Fields."
    }else if(loginerr=='incorrect'){
        message.value.text = "Username / Password combination is incorrect."
    }else if(loginerr=='noUser'){
        message.value.text = "No such user exists."
    }else if(loginerr == 'unknown'){
        message.value.text = "An unknown error occurred";
    }
}

// Prevent scrolling on mount
onMounted(() => {
    document.body.style.overflow = 'hidden';
});

// Restore scrolling on unmount
onUnmounted(() => {
    document.body.style.overflow = '';
});

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        username: formData.get("username"),
        password: formData.get("password"),
    };
    
    try {
        const response = await $fetch<{ message: string }>(`/api/users/me`, {
            method: "POST", 
            body: creds,
        });
        
        // Cookie is set by server with httpOnly flag
        console.log('Login successful, redirecting to:', redirect);
        message.value.type = "info";
        message.value.text = "Logging you in.";
        
        // Use window.location for a hard redirect to ensure middleware runs
        window.location.href = redirect;
    } catch (error: any) {
        console.error('Login error:', error);
        message.value.type = "error";
        
        if (error.statusCode === 401) {
            message.value.text = "Username / Password combination is incorrect.";
        } else if (error.statusCode === 400) {
            message.value.text = "Missing Fields.";
        } else if (error.statusCode === 503) {
            message.value.text = "Service temporarily unavailable. Please try again in a minute.";
        } else {
            message.value.text = "An error occurred during login.";
        }
    }
};
</script>