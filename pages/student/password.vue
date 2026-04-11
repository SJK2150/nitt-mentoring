<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8 relative">
        <MiscGeometricBg />
        <div class="max-w-2xl mx-auto relative z-10">
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900">Change Password</h1>
                <p class="text-gray-600 mt-2">Update your account password securely</p>
            </div>

            <div class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300 animate-slide-up">
                <form class="flex flex-col gap-6" @submit="handleSubmit">
                    <div class="flex flex-col gap-2">
                        <label htmlFor="current-password_field" class="text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <input
                            v-model="currentPassword"
                            name="current-password"
                            id="current-password_field"
                            type="password"
                            placeholder="Enter current password"
                            required
                            :disabled="loading"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label htmlFor="new-password_field" class="text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            v-model="newPassword"
                            name="new-password"
                            id="new-password_field"
                            type="password"
                            placeholder="Enter new password"
                            required
                            :disabled="loading"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50"
                        />
                        <p class="text-xs text-gray-500 mt-1">Minimum 8 characters, with uppercase, lowercase, and number</p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label htmlFor="confirm-password_field" class="text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            v-model="confirmPassword"
                            name="confirm-password"
                            id="confirm-password_field"
                            type="password"
                            placeholder="Confirm new password"
                            required
                            :disabled="loading"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50"
                        />
                    </div>
                    <MiscMessage
                        :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`"
                        :type="message.type"
                    >
                        {{ message.text }}
                    </MiscMessage>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ loading ? 'Updating...' : 'Update Password' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "level0"
})

const userStore = useUserStore();
const username = ref(userStore.username || "");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const message = ref({ type: "error", text: "" });

onMounted(async () => {
    if (username.value) return;
    const session = await useUserSession();
    if (session.ok) {
        username.value = session.user.username;
        userStore.username = session.user.username;
    }
});

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
        message.value = {
            type: "error",
            text: "New passwords do not match"
        };
        return;
    }

    if (newPassword.value.length < 8) {
        message.value = {
            type: "error",
            text: "Password must be at least 8 characters long"
        };
        return;
    }

    if (!/[A-Z]/.test(newPassword.value)) {
        message.value = {
            type: "error",
            text: "Password must contain at least one uppercase letter"
        };
        return;
    }

    if (!/[a-z]/.test(newPassword.value)) {
        message.value = {
            type: "error",
            text: "Password must contain at least one lowercase letter"
        };
        return;
    }

    if (!/[0-9]/.test(newPassword.value)) {
        message.value = {
            type: "error",
            text: "Password must contain at least one number"
        };
        return;
    }

    loading.value = true;
    message.value = { type: "error", text: "" };

    if (!username.value) {
        message.value = {
            type: "error",
            text: "Unable to identify user session. Please login again."
        };
        loading.value = false;
        return;
    }

    try {
        await $fetch('/api/users/password', {
            method: "PATCH",
            body: {
                username: username.value,
                oldPassword: currentPassword.value,
                newPassword: newPassword.value,
            },
        });

        message.value = {
            type: "info",
            text: "Password has been changed successfully."
        };

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
    } catch (error: any) {
        message.value = {
            type: "error",
            text: error.data?.statusMessage || "Failed to change password. Please check your current password."
        };
    } finally {
        loading.value = false;
    }
}
</script>
