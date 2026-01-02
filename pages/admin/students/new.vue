<template>
    <div class="min-h-screen bg-nitMaroon-50 p-8">
        <div class="max-w-2xl mx-auto">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900">Create Student Account</h1>
                <p class="text-gray-600 mt-2">Add a new UG or PG student to the system</p>
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
                        Roll Number
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="Enter Roll Number" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label htmlFor="password_field" class="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Create a secure password" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                
                <!-- Course Selection -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700">Course</label>
                    <select name="year" v-model="studentType" required
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors">
                        <option value="" hidden>Select Course</option>
                        <option value="UG">UG</option>
                        <option value="PG">PG</option>
                    </select>
                </div>
                
                <!-- UG-Specific Fields -->
                <div v-if="studentType === 'UG'" class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700">Batch</label>
                        <input name="batch" type="number" placeholder="2024" required
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700">Section</label>
                        <input name="section" type="text" placeholder="A" required
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                    </div>
                </div>
                
                <!-- PG-Specific Fields -->
                <div v-if="studentType === 'PG'" class="grid grid-cols-1 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700">UG CGPA (Optional)</label>
                        <input name="ugCGPA" type="number" step="0.01" min="0" max="10" placeholder="8.5"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700">GATE Score (Optional)</label>
                        <input name="gateScore" type="number" min="0" max="1000" placeholder="750"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700">Work Experience (Optional)</label>
                        <textarea name="workExperience" placeholder="e.g., 2 years at XYZ Company" rows="2"
                            class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors resize-none"></textarea>
                    </div>
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
                <MiscMessage
                    :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`"
                    :type="message.type">
                    {{ message.text }}
                </MiscMessage>
                
                <button type="submit"
                    class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded shadow-sm hover:shadow transition-shadow duration-300">
                    Create Student Account
                </button>
            </form>
            </div>
            
            <!-- Bulk Upload Section -->
            <div class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-8 mt-6 animate-slide-up" style="animation-delay: 0.1s">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Bulk Upload</h2>
                <p class="text-gray-600 mb-6">Upload an Excel file (.xlsx or .xls) to create multiple student accounts at once</p>
                
                <div class="flex flex-col gap-4">
                    <input type="file" accept=".xlsx,.xls" ref="fileInput" @change="handleFileChange"
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-nitMaroon-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-nitMaroon-700" />
                    
                    <button @click="uploadFile"
                        class="px-6 py-3 bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white font-medium rounded shadow-sm transition-colors duration-200">
                        Upload Excel File
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { read, utils } from 'xlsx';

interface studentData {
    name: string;
    regno: string;
    password: string;
    department: string;
    batch?: number;
    year: string;
    section?: string;
    ugCGPA?: number;
    gateScore?: number;
    workExperience?: string;
}

const studentType = ref('UG');
const stud = ref<studentData[]>([]);

const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const wb = read(arrayBuffer);

        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData: any[] = utils.sheet_to_json(ws);

        // Process data based on student type
        const processedData: studentData[] = rawData.map((element) => {
            const processed: studentData = {
                name: element.name,
                regno: element.regno?.toString() || '',
                password: element.password || 'defaultPassword123', // Provide default if not in Excel
                department: element.department,
                year: element.year,
                // Only set UG-specific fields if the student is UG
                ...(element.year === 'UG' && {
                    batch: element.batch,
                    section: element.section
                }),
                // Only set PG-specific fields if the student is PG
                ...(element.year === 'PG' && {
                    ugCGPA: element.ugCGPA || 0,
                    gateScore: element.gateScore || 0,
                    workExperience: element.workExperience || ''
                })
            };

            return processed;
        });

        stud.value = processedData;
    };

    reader.readAsArrayBuffer(file);
};

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const selectedFile = fileInput.files?.[0];
    if (selectedFile) {
        handleFileUpload(selectedFile);
    }
};

const uploadFile = async (e: Event) => {
    e.preventDefault();

    stud.value.forEach(async (element) => {
        await upload(element);
    })
}

async function upload(record: studentData) {
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", 
        body: JSON.stringify(record),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "Please verify the data."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()
        }
    })
}

definePageMeta({
    middleware: "level2"
})
const route = useRoute();

const message = ref({ type: "error", text: "" })

const dept = await useDept()
  const emit = defineEmits(['deleted'])
const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    
    const creds: studentData = {
        name: formData.get("name") as string,
        regno: formData.get("username") as string,
        password: formData.get("password") as string,
        department: formData.get("department") as string,
        year: formData.get("year") as string,
    };

    // Add conditional fields based on student type
    if (creds.year === 'UG') {
        creds.batch = Number(formData.get("batch"));
        creds.section = formData.get("section") as string;
    } else if (creds.year === 'PG') {
        const ugCGPA = formData.get("ugCGPA");
        const gateScore = formData.get("gateScore");
        const workExp = formData.get("workExperience");
        
        creds.ugCGPA = ugCGPA ? Number(ugCGPA) : 0;
        creds.gateScore = gateScore ? Number(gateScore) : 0;
        creds.workExperience = workExp ? workExp as string : "";
    }

    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", 
        body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "Please verify the data."
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