<template>
  <div class="min-h-screen bg-nitMaroon-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-nitMaroon-600 rounded-xl mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">Enter your username to receive reset instructions</p>
      </div>

      <div class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-8">
        <form @submit="handleSubmit" class="space-y-5">
          <div>
            <label for="email_field" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              name="username"
              id="email_field"
              type="text"
              placeholder="Enter your username"
              class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>

          <MiscMessage
            v-if="message.text"
            class="transition-all duration-300"
            :type="message.type"
          >
            {{ message.text }}
          </MiscMessage>

          <button
            type="submit"
            class="bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white py-3 px-4 rounded font-medium transition-colors duration-200 shadow-sm"
          >
            Send Reset Link
          </button>

          <div class="text-center pt-2">
            <a href="/login" class="text-sm text-nitMaroon-600 hover:text-nitMaroon-700 font-medium">
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFetch } from "nuxt/app";

const message = ref({ type: "error", text: "" });

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form as HTMLFormElement);
  const username = formData.get("username");

  try {
    const { data } = await useFetch("/api/users/password-reset", {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    if (data.value) {
      message.value = {
        type: data.value.statusCode === 200 ? "info" : "error",
        text: data.value.body.message,
      };
    }
  } catch (err) {
    console.error("Error:", err);
    message.value = {
      type: "error",
      text: "An unexpected error occurred.",
    };
  }
};
</script>
