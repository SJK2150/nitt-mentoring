<template>
    <div class="lg:px-4 mx-auto w-full flex flex-col items-start lg:items-center">
        <InfoMentee v-if="mentee" :mentee="mentee" />
        <div v-if="mentee"
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-lg rounded-xl max-w-6xl w-full">
            <h1 class="text-2xl font-bold">Update Student Info</h1>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div v-for="field in specialFields" :key="field" class="flex flex-col items-center gap-2">
                        <label :htmlFor="field" class="w-full text-start">
                            {{ field.split("_").map(x => x.slice(0, 1).toUpperCase() + x.slice(1)).join(" ") }}
                        </label>
                        <textarea :name="field" :id="field" :value="mentee.achievements[field]"
                            class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                    </div>
                </div>
                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Create User
                </button>
            </form>
            <hr class="border border-stone-400 w-full lg:w-96" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Student } from '~/types/types';

definePageMeta({
    middleware: [
        "level1"
    ]
})



const message = ref({ type: "error", text: "" })
const route = useRoute();

const regno = route.params.regno as string;

const mentee = await useMentee(regno)

if (!mentee) {
    nextTick(() => {
        alert("No such student exists with Reg #" + regno)
        navigateTo("/dashboard")
    })
}
const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds: Student["achievements"] = {};
    for (const key of specialFields) {
        creds[key] = formData.get(key) as string || ""
    }
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${regno}/special`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "success"
            message.value.text = "Updated details."
            navigateTo(`/dashboard/mentees/${regno}`)
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