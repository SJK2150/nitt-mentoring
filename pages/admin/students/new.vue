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
                    <p class="text-xs text-gray-500 mt-1">Minimum 8 characters, with uppercase, lowercase, and number</p>
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
                
                <!-- File Upload -->
                <div class="flex flex-col gap-4">
                    <input type="file" accept=".xlsx,.xls" ref="fileInput" @change="handleFileChange" :disabled="isUploading"
                        class="px-4 py-3 rounded border border-gray-300 bg-yellow-50 focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-nitMaroon-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-nitMaroon-700 disabled:opacity-50 disabled:cursor-not-allowed" />
                    
                    <!-- Progress Display -->
                    <div v-if="isUploading" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-blue-900">Uploading students...</span>
                            <span class="text-sm font-semibold text-blue-900">{{ uploadProgress.current }} / {{ uploadProgress.total }}</span>
                        </div>
                        <div class="w-full bg-blue-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                 :style="{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }"></div>
                        </div>
                        <p class="text-xs text-blue-700 mt-2">Please wait, do not close this page...</p>
                    </div>
                    
                    <!-- Upload Results -->
                    <div v-if="uploadResults.show" class="space-y-3">
                        <!-- Success Summary -->
                        <div v-if="uploadResults.successful.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-green-900 mb-2">✓ Successfully created {{ uploadResults.successful.length }} student(s)</h3>
                            <div class="max-h-32 overflow-y-auto space-y-1">
                                <p v-for="student in uploadResults.successful" :key="student" class="text-xs text-green-800">
                                    • {{ student }}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Error Summary -->
                        <div v-if="uploadResults.failed.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-red-900 mb-2">✗ Failed to create {{ uploadResults.failed.length }} student(s)</h3>
                            <div class="max-h-32 overflow-y-auto space-y-1">
                                <p v-for="error in uploadResults.failed" :key="error.student" class="text-xs text-red-800">
                                    • {{ error.student }}: {{ error.reason }}
                                </p>
                            </div>
                        </div>
                        
                        <button @click="resetUpload" class="text-sm text-nitMaroon-600 hover:text-nitMaroon-700 font-medium">
                            Upload another file
                        </button>
                    </div>
                    
                    <button @click="uploadFile" :disabled="isUploading || stud.length === 0"
                        :class="['px-6 py-3 text-white font-medium rounded shadow-sm transition-colors duration-200',
                                 isUploading || stud.length === 0 
                                 ? 'bg-gray-400 cursor-not-allowed' 
                                 : 'bg-nitMaroon-600 hover:bg-nitMaroon-700']">
                        {{ isUploading ? 'Uploading...' : `Upload ${stud.length > 0 ? stud.length + ' Student(s)' : 'Excel File'}` }}
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
}

const studentType = ref('UG');
const stud = ref<studentData[]>([]);
const isUploading = ref(false);
const uploadProgress = ref({ current: 0, total: 0 });
const uploadResults = ref({
    show: false,
    successful: [] as string[],
    failed: [] as { student: string; reason: string }[]
});

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

    if (stud.value.length === 0) {
        message.value.type = "error";
        message.value.text = "No students to upload. Please select an Excel file first.";
        return;
    }

    // Reset results
    isUploading.value = true;
    uploadProgress.value = { current: 0, total: stud.value.length };
    uploadResults.value = {
        show: false,
        successful: [],
        failed: []
    };

    try {
        // Send all students in one bulk request
        // The httpOnly cookie (nitt_token) is automatically sent by the browser
        const response = await $fetch<{
            success: boolean;
            total: number;
            successCount: number;
            failedCount: number;
            results: {
                successful: Array<{ regno: string; name: string }>;
                failed: Array<{ regno: string; name: string; reason: string }>;
            };
        }>('/api/mentees/bulk', {
            method: 'POST',
            body: stud.value,
        });

        // Update progress
        uploadProgress.value.current = uploadProgress.value.total;

        // Format results for display
        uploadResults.value.successful = response.results.successful.map(
            s => `${s.name} (${s.regno})`
        );
        uploadResults.value.failed = response.results.failed.map(
            f => ({ student: `${f.name} (${f.regno})`, reason: f.reason })
        );
        uploadResults.value.show = true;

        // Update main message
        if (response.failedCount === 0) {
            message.value.type = "info";
            message.value.text = `Successfully created all ${response.successCount} student accounts!`;
        } else {
            message.value.type = "error";
            message.value.text = `Created ${response.successCount} accounts, ${response.failedCount} failed.`;
        }
    } catch (error: any) {
        let errorMessage = 'Unknown error occurred';
        
        if (error.statusCode === 401) {
            errorMessage = 'Not authenticated. Please login again.';
        } else if (error.statusCode === 403) {
            errorMessage = 'You do not have permission to perform this action.';
        } else if (error.statusCode === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a few minutes and try again.';
        } else if (error.data?.statusMessage) {
            errorMessage = error.data.statusMessage;
        } else if (error.message) {
            errorMessage = error.message;
        }

        message.value.type = "error";
        message.value.text = errorMessage;
        uploadResults.value.show = false;
    } finally {
        isUploading.value = false;
    }
}

const resetUpload = () => {
    stud.value = [];
    uploadResults.value = {
        show: false,
        successful: [],
        failed: []
    };
    uploadProgress.value = { current: 0, total: 0 };
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
}

// Note: upload() function is no longer needed with bulk endpoint
// Keeping it here for backwards compatibility if needed
async function upload(record: studentData): Promise<{ success: boolean; name: string; error?: string }> {
    try {
        const response = await $fetch(`/api/mentees/new`, {
            method: "POST",
            body: record,
        });
        
        return { success: true, name: `${record.name} (${record.regno})` };
    } catch (error: any) {
        let errorMessage = 'Unknown error';
        
        if (error.statusCode === 400) {
            errorMessage = 'Missing or invalid fields';
        } else if (error.statusCode === 401) {
            errorMessage = 'Authentication failed';
        } else if (error.statusCode === 409) {
            errorMessage = 'Student already exists';
        } else if (error.data?.statusMessage) {
            errorMessage = error.data.statusMessage;
        }
        
        return { success: false, name: `${record.name} (${record.regno})`, error: errorMessage };
    }
}

definePageMeta({
    middleware: "level2",
    alias: ["/hod/students/new"]
})

const route = useRoute();
if (route.path === "/admin/students/new") {
    await navigateTo("/hod/students/new", { replace: true });
}

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
    }

    try {
        await $fetch(`/api/mentees/new`, {
            method: "POST",
            body: creds,
        });
        message.value.type = "info";
        message.value.text = "Created student account.";
    } catch (error: any) {
        message.value.type = "error";
        switch (error?.statusCode) {
            case 400:
                message.value.text = error?.data?.message || "Missing or invalid fields.";
                break;
            case 401:
                message.value.text = "Not authenticated. Please login again.";
                break;
            case 403:
                message.value.text = "You do not have permission.";
                break;
            case 429:
                message.value.text = "Too many requests. Please try again later.";
                break;
            default:
                message.value.text = error?.data?.statusMessage || "An unknown error occurred";
                break;
        }
    }
};
</script>