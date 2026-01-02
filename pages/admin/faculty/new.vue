<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8">
        <div class="max-w-2xl mx-auto">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900">Create Faculty Account</h1>
                <p class="text-gray-600 mt-2">Add a new faculty member to the mentoring system</p>
            </div>
            
            <!-- Form Card -->
            <div class="bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-300 animate-slide-up">
            <form class="flex flex-col gap-6" @submit="e => handleSubmit(e)">
                <div class="flex flex-col gap-2">
                    <label htmlFor="name_field" class="text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input name="name" id="name_field" type="text" placeholder="John Doe" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>

                <div class="flex flex-col gap-2">
                    <label htmlFor="username_field" class="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="johndoe" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="password_field" class="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Create a secure password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="dept_field" class="text-sm font-medium text-gray-700">
                        Department
                    </label>
                    <select name="department" id="dept_field" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors">
                        <option value="" disabled selected>Select Department</option>
                        <option v-for="dep in dept" :key="dep.id" :value="dep.id">{{ dep.name }}</option>
                    </select>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="type_field" class="text-sm font-medium text-gray-700">
                        Role Type
                    </label>
                    <select name="level" id="type_field" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors">
                        <option value="" disabled selected>Select Role</option>
                        <option :value="1">Faculty</option>
                        <option :value="2">HOD</option>
                    </select>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="faculty_field" class="text-sm font-medium text-gray-700">
                        Faculty ID
                    </label>
                    <input name="faculty_id" id="faculty_field" type="text" placeholder="Enter Faculty ID" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                <MiscMessage
                    :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`"
                    :type="message.type">
                    {{ message.text }}
                </MiscMessage>
                
                <button type="submit"
                    class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300">
                    Create Faculty Account
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
const route = useRoute();

const message = ref({ type: "error", text: "" })

const dept = await useDept()

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password"),
        level: Math.min(Number(formData.get("level")), 2),
        department: formData.get("department"),
        faculty_id: formData.get("faculty_id")
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/faculty/new`, {
        method: "POST", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "Can't grant the access"
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