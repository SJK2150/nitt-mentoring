<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8">
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Admin: Reset User Password</h1>
                <p class="text-gray-600 mt-2">Reset password for any user account</p>
            </div>
            <div class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300">
            <form class="flex flex-col gap-6" @submit="e => handleSubmit(e)">
                <div class="flex flex-col gap-2">
                    <label htmlFor="username_field" class="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="Enter username" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                <div class="flex flex-col gap-2">
                    <label htmlFor="password_field" class="text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Enter new password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                    <p class="text-xs text-gray-500 mt-1">Minimum 8 characters, with uppercase, lowercase, and number</p>
                </div>
                <div class="flex flex-col gap-2">
                    <label htmlFor="confirm_password_field" class="text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input name="confirmPassword" id="confirm_password_field" type="password" placeholder="Confirm new password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition-opacity duration-300`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit" :disabled="loading"
                    class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ loading ? 'Resetting...' : 'Reset Password' }}
                </button>
            </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "level3"
})

const message = ref({ type: "error", text: "" })
const loading = ref(false)

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    // Client-side validation
    if (!username || !password || !confirmPassword) {
        message.value.type = "error";
        message.value.text = "All fields are required";
        return;
    }
    
    if (password !== confirmPassword) {
        message.value.type = "error";
        message.value.text = "Passwords do not match";
        return;
    }
    
    if (password.length < 8) {
        message.value.type = "error";
        message.value.text = "Password must be at least 8 characters";
        return;
    }
    
    if (!/[A-Z]/.test(password)) {
        message.value.type = "error";
        message.value.text = "Password must contain at least one uppercase letter";
        return;
    }
    
    if (!/[a-z]/.test(password)) {
        message.value.type = "error";
        message.value.text = "Password must contain at least one lowercase letter";
        return;
    }
    
    if (!/[0-9]/.test(password)) {
        message.value.type = "error";
        message.value.text = "Password must contain at least one number";
        return;
    }
    
    loading.value = true;
    message.value.text = "";
    
    try {
        await $fetch('/api/users/password-reset-admin', {
            method: "PATCH",
            body: { username, newPassword: password },
        });
        
        message.value.type = "info";
        message.value.text = `Password reset successfully for user: ${username}`;
        
        // Clear form
        (form as HTMLFormElement).reset();
    } catch (error: any) {
        console.error('Password reset error:', error);
        message.value.type = "error";
        message.value.text = error.data?.statusMessage || "Failed to reset password";
    } finally {
        loading.value = false;
    }
};
</script>