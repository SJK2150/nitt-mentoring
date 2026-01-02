<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8">
        <div class="max-w-2xl mx-auto">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900">Change Password</h1>
                <p class="text-gray-600 mt-2">Update your account password securely</p>
            </div>
            
            <!-- Form Card -->
            <div class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300 animate-slide-up">
            <form class="flex flex-col gap-6" @submit="e => handleSubmit(e)">
                <div class="flex flex-col gap-2">
                    <label htmlFor="current-password_field" class="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input name="current-password" id="current-password_field" type="password" placeholder="Enter current password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="new-password_field" class="text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input name="new-password" id="new-password_field" type="password" placeholder="Enter new password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="confirm-password_field" class="text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input name="confirm-password" id="confirm-password_field" type="password" placeholder="Confirm new password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                <MiscMessage
                    :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`"
                    :type="message.type">
                    {{ message.text }}
                </MiscMessage>
                
                <button type="submit"
                    class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300">
                    Update Password
                </button>
            </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "level1"
})
const route = useRoute();
const userStore = useUserStore();
const username=userStore.username;

const message = ref({ type: "error", text: "" })

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        
        currentPassword: formData.get("current-password"),
        newPassword: formData.get("new-password"),
        confirmPassword: formData.get("confirm-password"),
        username:username
        
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/users/password`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Password has been changed successfully."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            console.log(response);
            switch (response.statusText) {
                case "ENTER_CURRENT_PASSWORD":
                    message.value.text = "Please enter your current password";
                    break;
                case "CONFIRM_PASSWORD":
                    message.value.text = "Please confirm your new password"
                    break;
                case "PASSWORD_MISMATCH":
                    message.value.text = "Please make sure the new password's match"
                    break;   
                case "USER_NOT_FOUND":
                    message.value.text = "User not found"
                    break;  
                case "WRONG_CURRENT_PASSWORD":
                    message.value.text = "Incorrect current password"
                    break;  
                case "INTERNAL_SERVER_ERROR":  
                    message.value.text="Internal server error";
                    break;          
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()

        }    })
};
</script>