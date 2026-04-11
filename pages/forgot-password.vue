<template>
  <div class="fixed inset-0 overflow-hidden bg-nitMaroon-50 flex items-center justify-center p-6">
    <MiscGeometricBg />
    <div class="w-full max-w-md relative z-10 overflow-y-auto max-h-full py-4">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-nitMaroon-600 rounded-xl mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">
          {{ step === 1 ? 'Enter your username to receive a reset code' : 'Enter the 6-digit code sent to your email' }}
        </p>
      </div>

      <div class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-8">
        <!-- Step 1: Request Reset Code -->
        <form v-if="step === 1" @submit="handleRequestCode" class="space-y-5">
          <div>
            <label for="username_field" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              v-model="username"
              name="username"
              id="username_field"
              type="text"
              placeholder="Enter your username"
              required
              :disabled="loading"
              class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            :disabled="loading"
            class="w-full bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white py-3 px-4 rounded font-medium transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Sending...' : 'Send Reset Code' }}
          </button>

          <div class="text-center pt-2">
            <a href="/login" class="text-sm text-nitMaroon-600 hover:text-nitMaroon-700 font-medium">
              Back to login
            </a>
          </div>
        </form>

        <!-- Step 2: Verify Code and Reset Password -->
        <form v-else @submit="handleResetPassword" class="space-y-5">
          <div>
            <label for="username_display" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              v-model="username"
              id="username_display"
              type="text"
              readonly
              class="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>

          <div>
            <label for="code_field" class="block text-sm font-medium text-gray-700 mb-2">
              Reset Code
            </label>
            <input
              v-model="code"
              name="code"
              id="code_field"
              type="text"
              maxlength="6"
              placeholder="Enter 6-digit code"
              required
              :disabled="loading"
              class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono"
            />
            <p class="text-xs text-gray-500 mt-1">Code expires in 10 minutes</p>
          </div>

          <div>
            <label for="new_password_field" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              v-model="newPassword"
              name="new_password"
              id="new_password_field"
              type="password"
              placeholder="Enter new password"
              required
              :disabled="loading"
              class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 8 characters, with uppercase, lowercase, and number</p>
          </div>

          <div>
            <label for="confirm_password_field" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              name="confirm_password"
              id="confirm_password_field"
              type="password"
              placeholder="Confirm new password"
              required
              :disabled="loading"
              class="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            :disabled="loading"
            class="w-full bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white py-3 px-4 rounded font-medium transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>

          <div class="text-center pt-2">
            <button 
              type="button" 
              @click="resetForm"
              class="text-sm text-nitMaroon-600 hover:text-nitMaroon-700 font-medium"
            >
              Request new code
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const step = ref(1);
const username = ref("");
const code = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const message = ref({ type: "error", text: "" });

// Prevent scrolling on mount
onMounted(() => {
    document.body.style.overflow = 'hidden';
});

// Restore scrolling on unmount
onUnmounted(() => {
    document.body.style.overflow = '';
});

const handleRequestCode = async (e: Event) => {
  e.preventDefault();
  loading.value = true;
  message.value = { type: "error", text: "" };

  try {
    const response = await $fetch("/api/users/password-reset", {
      method: "POST",
      body: { username: username.value },
    });

    message.value = {
      type: "info",
      text: "If this username exists, a 6-digit code has been sent to your email.",
    };
    
    // Move to step 2 after 2 seconds
    setTimeout(() => {
      step.value = 2;
      message.value = { type: "error", text: "" };
    }, 2000);
  } catch (err: any) {
    console.error("Error:", err);
    message.value = {
      type: "error",
      text: err.data?.statusMessage || "Failed to send reset code. Please try again.",
    };
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async (e: Event) => {
  e.preventDefault();
  
  // Validate passwords match
  if (newPassword.value !== confirmPassword.value) {
    message.value = {
      type: "error",
      text: "Passwords do not match.",
    };
    return;
  }

  // Validate password strength
  if (newPassword.value.length < 8) {
    message.value = {
      type: "error",
      text: "Password must be at least 8 characters long.",
    };
    return;
  }

  if (!/[A-Z]/.test(newPassword.value)) {
    message.value = {
      type: "error",
      text: "Password must contain at least one uppercase letter.",
    };
    return;
  }

  if (!/[a-z]/.test(newPassword.value)) {
    message.value = {
      type: "error",
      text: "Password must contain at least one lowercase letter.",
    };
    return;
  }

  if (!/[0-9]/.test(newPassword.value)) {
    message.value = {
      type: "error",
      text: "Password must contain at least one number.",
    };
    return;
  }

  // Validate code format
  if (!/^\d{6}$/.test(code.value)) {
    message.value = {
      type: "error",
      text: "Code must be 6 digits.",
    };
    return;
  }

  loading.value = true;
  message.value = { type: "error", text: "" };

  try {
    const response = await $fetch("/api/users/password-reset", {
      method: "PATCH",
      body: {
        username: username.value,
        code: code.value,
        newPassword: newPassword.value,
      },
    });

    message.value = {
      type: "info",
      text: "Password reset successful! Redirecting to login...",
    };

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigateTo("/login");
    }, 2000);
  } catch (err: any) {
    console.error("Error:", err);
    message.value = {
      type: "error",
      text: err.data?.statusMessage || "Failed to reset password. Please check your code and try again.",
    };
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  step.value = 1;
  code.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  message.value = { type: "error", text: "" };
};
</script>
