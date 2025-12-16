<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold text-gray-900">Change Password</h1>
        <p class="text-gray-600 mt-2">Update your account password using the reset link</p>
      </div>
      
      <!-- Form Card -->
      <div class="bg-green-50 rounded-lg shadow-sm p-8 border border-green-200 animate-slide-up">
      <form class="flex flex-col gap-6" @submit="handleSubmit">
        <div class="flex flex-col gap-2">
          <label htmlFor="username_field" class="text-sm font-semibold text-gray-700">
            Username
          </label>
          <input
            v-model="username"
            name="username"
            id="username_field"
            type="text"
            placeholder="Your username"
            readonly
            class="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 cursor-not-allowed"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label htmlFor="password_field" class="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            v-model="password"
            name="password"
            id="password_field"
            type="password"
            placeholder="Enter new password"
            required
            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label htmlFor="confirm_password_field" class="text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            v-model="confirmPassword"
            name="confirm_password"
            id="confirm_password_field"
            type="password"
            placeholder="Confirm new password"
            required
            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
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
          class="w-full px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300"
        >
          Change Password
        </button>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";

const route = useRoute();
const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref({ type: "error", text: "" });
const token = ref("");

onMounted(() => {
  token.value = route.query.token as string;
  if (!token.value) {
    message.value = { type: "error", text: "Invalid or missing token." };
    return;
  }

  try {
    const decoded = jwtDecode(token.value) as { username: string; exp: number };
    if (Date.now() >= decoded.exp * 1000) {
      message.value = { type: "error", text: "Token has expired." };
      return;
    }
    username.value = decoded.username;
  } catch (error) {
    message.value = { type: "error", text: "Invalid token." };
  }
});

const validatePassword = () => {
  if (password.value !== confirmPassword.value) {
    message.value = { type: "error", text: "Passwords do not match." };
    return false;
  }
  if (password.value.length < 8) {
    message.value = {
      type: "error",
      text: "Password must be at least 8 characters long.",
    };
    return false;
  }
  return true;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!validatePassword()) return;

  try {
    const { data } = await useFetch("/api/users/password-reset", {
      method: "PATCH",
      body: JSON.stringify({
        username: username.value,
        newPassword: password.value,
        token: token.value,
      }),
    });
    if (data.value) {
      message.value = {
        type: data.value.statusCode === 200 ? "info" : "error",
        text: data.value.body.message,
      };
      if (data.value.statusCode === 200) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  } catch (error: any) {
    message.value = {
      type: "error",
      text: error.message || "An error occurred while changing the password.",
    };
  }
};
</script>
