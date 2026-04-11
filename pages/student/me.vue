<template>
    <div class="min-h-screen bg-nitMaroon-50 dotted-bg p-4 md:p-8 relative">
        <MiscGeometricBg />
        
        <div v-if="mentee" class="max-w-7xl mx-auto relative z-10">
            
            <!-- Bento Grid Layout -->
            <div class="bento-grid gap-4">
                
                <!-- Student Info Card (Wide) -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 col-span-full lg:col-span-2 hover:border-nitMaroon-300">
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-nitMaroon-500 to-nitMaroon-700 flex items-center justify-center text-white font-bold text-3xl border-4 border-nitMaroon-100">
                            {{ mentee.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ mentee.name }}</h1>
                            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>{{ mentee.register_number }}</span>
                                <span>•</span>
                                <span>Mentor: {{ mentee.mentor.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Basic Info Card -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Basic Info</h2>
                    <form @submit="e => updateBasic(e)" class="space-y-4">
                        <div class="space-y-3">
                            <div>
                                <label for="student_batch" class="block text-xs font-semibold text-gray-700 mb-1">Batch</label>
                                <input type="number" name="student_batch" id="student_batch" 
                                    class="bento-input"
                                    :value="mentee.batch" />
                            </div>
                            <div>
                                <label for="student_year" class="block text-xs font-semibold text-gray-700 mb-1">Year</label>
                                <input type="number" name="student_year" id="student_year"
                                    class="bento-input"
                                    :value="mentee.year" />
                            </div>
                            <div>
                                <label for="student_section" class="block text-xs font-semibold text-gray-700 mb-1">Section</label>
                                <input type="text" name="student_section" id="student_section"
                                    class="bento-input"
                                    :value="mentee.section" />
                            </div>
                        </div>
                        <MiscMessage v-if="basicMessage.text" :type="basicMessage.type" class="text-sm">
                            {{ basicMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700 w-full">
                            Update
                        </button>
                    </form>
                </div>

                <!-- Personal Info Card (Tall) -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 lg:row-span-2 hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Personal</h2>
                    <form @submit="e => updatePersonal(e)" class="space-y-4">
                        <div class="space-y-3">
                            <div>
                                <label for="student_blood" class="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
                                <input type="text" name="student_blood" id="student_blood"
                                    class="bento-input"
                                    :value="mentee.personal_info.blood_group" />
                            </div>
                            <div>
                                <label for="student_mobile" class="block text-xs font-semibold text-gray-700 mb-1">Mobile</label>
                                <input type="text" name="student_mobile" id="student_mobile"
                                    class="bento-input"
                                    :value="mentee.personal_info.mobile_number" />
                            </div>
                            <div>
                                <label for="student_whatsapp" class="block text-xs font-semibold text-gray-700 mb-1">WhatsApp</label>
                                <input type="text" name="student_whatsapp" id="student_whatsapp"
                                    class="bento-input"
                                    :value="mentee.personal_info.whatsapp_number" />
                            </div>
                            <div>
                                <label for="student_date_of_birth" class="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" name="student_date_of_birth" id="student_date_of_birth"
                                    class="bento-input"
                                    :value="new Date(mentee.personal_info.date_of_birth || 0).toISOString().split(`T`)[0]" />
                            </div>
                            <div>
                                <label for="student_gender" class="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                                <select name="student_gender" id="student_gender" class="bento-input">
                                    <option value="male" :selected="mentee.personal_info.gender === `male`">Male</option>
                                    <option value="female" :selected="mentee.personal_info.gender === `female`">Female</option>
                                </select>
                            </div>
                            <div>
                                <label for="student_email_id" class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input type="email" name="student_email_id" id="student_email_id"
                                    class="bento-input"
                                    :value="mentee.personal_info.email_id" />
                            </div>
                        </div>
                        <MiscMessage v-if="personalMessage.text" :type="personalMessage.type" class="text-sm">
                            {{ personalMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700 w-full">
                            Save
                        </button>
                    </form>
                </div>

                <!-- Father Info Card -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 col-span-full lg:col-span-2 hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Father Information</h2>
                    <form @submit="e => updateFather(e)" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label for="student_f_name" class="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input type="text" name="student_f_name" id="student_f_name"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.name" />
                            </div>
                            <div>
                                <label for="student_f_occupation" class="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                                <input type="text" name="student_f_occupation" id="student_f_occupation"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.occupation" />
                            </div>
                            <div>
                                <label for="student_f_mobile" class="block text-xs font-semibold text-gray-700 mb-1">Mobile</label>
                                <input type="text" name="student_f_mobile" id="student_f_mobile"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.mobile_number" />
                            </div>
                            <div>
                                <label for="student_f_whatsapp" class="block text-xs font-semibold text-gray-700 mb-1">WhatsApp</label>
                                <input type="text" name="student_f_whatsapp" id="student_f_whatsapp"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.whatsapp_number" />
                            </div>
                            <div>
                                <label for="student_f_email_id" class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input type="email" name="student_f_email_id" id="student_f_email_id"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.email_id" />
                            </div>
                            <div>
                                <label for="student_f_address" class="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                                <input type="text" name="student_f_address" id="student_f_address"
                                    class="bento-input"
                                    :value="mentee.personal_info.father?.address" />
                            </div>
                        </div>
                        <MiscMessage v-if="fatherMessage.text" :type="fatherMessage.type" class="text-sm">
                            {{ fatherMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700">
                            Save Changes
                        </button>
                    </form>
                </div>

                <!-- Mother Info Card -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 col-span-full lg:col-span-2 hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Mother Information</h2>
                    <form @submit="e => updateMother(e)" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label for="student_m_name" class="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input type="text" name="student_m_name" id="student_m_name"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.name" />
                            </div>
                            <div>
                                <label for="student_m_occupation" class="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                                <input type="text" name="student_m_occupation" id="student_m_occupation"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.occupation" />
                            </div>
                            <div>
                                <label for="student_m_mobile" class="block text-xs font-semibold text-gray-700 mb-1">Mobile</label>
                                <input type="text" name="student_m_mobile" id="student_m_mobile"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.mobile_number" />
                            </div>
                            <div>
                                <label for="student_m_whatsapp" class="block text-xs font-semibold text-gray-700 mb-1">WhatsApp</label>
                                <input type="text" name="student_m_whatsapp" id="student_m_whatsapp"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.whatsapp_number" />
                            </div>
                            <div>
                                <label for="student_m_email_id" class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input type="email" name="student_m_email_id" id="student_m_email_id"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.email_id" />
                            </div>
                            <div>
                                <label for="student_m_address" class="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                                <input type="text" name="student_m_address" id="student_m_address"
                                    class="bento-input"
                                    :value="mentee.personal_info.mother?.address" />
                            </div>
                        </div>
                        <MiscMessage v-if="motherMessage.text" :type="motherMessage.type" class="text-sm">
                            {{ motherMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700">
                            Save Changes
                        </button>
                    </form>
                </div>

                <!-- Achievements Card (Wide) -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 col-span-full hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Achievements & Special Info</h2>
                    <form @submit="e => updateSpecial(e)" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="field in specialFields" :key="field">
                                <label :for="field" class="block text-xs font-semibold text-gray-700 mb-1">
                                    {{field.split("_").map(x => x.slice(0, 1).toUpperCase() + x.slice(1)).join(" ")}}
                                </label>
                                <textarea :name="field" :id="field" :value="mentee.achievements[field]"
                                    rows="3"
                                    class="bento-input resize-none" />
                            </div>
                        </div>
                        <MiscMessage v-if="specialMessage.text" :type="specialMessage.type" class="text-sm">
                            {{ specialMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700">
                            Save
                        </button>
                    </form>
                </div>

                <!-- Academic Qualifications Card (Wide) -->
                <div class="bento-card bg-white border-2 border-nitMaroon-200 p-6 col-span-full hover:border-nitMaroon-300">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Academic Qualifications</h2>
                    <form @submit="e => updateAcademic(e)" class="space-y-6">
                        
                        <!-- SSLC Section -->
                        <div class="bg-nitMaroon-50 p-4 rounded-xl border border-nitMaroon-200">
                            <h3 class="text-sm font-bold text-gray-900 mb-3">SSLC (10th)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label for="student_sslc_institution" class="block text-xs font-semibold text-gray-700 mb-1">Institution</label>
                                    <input type="text" name="student_sslc_institution" id="student_sslc_institution"
                                        class="bento-input"
                                        :value="mentee.past.sslc?.institution" />
                                </div>
                                <div>
                                    <label for="student_sslc_board" class="block text-xs font-semibold text-gray-700 mb-1">Board</label>
                                    <input type="text" name="student_sslc_board" id="student_sslc_board"
                                        class="bento-input"
                                        :value="mentee.past.sslc?.board_of_study" />
                                </div>
                                <div>
                                    <label for="student_sslc_year" class="block text-xs font-semibold text-gray-700 mb-1">Year</label>
                                    <input type="text" name="student_sslc_year" id="student_sslc_year"
                                        class="bento-input"
                                        :value="mentee.past.sslc?.year_of_study" />
                                </div>
                                <div>
                                    <label for="student_sslc_cgpa" class="block text-xs font-semibold text-gray-700 mb-1">Percentage</label>
                                    <input type="text" name="student_sslc_cgpa" id="student_sslc_cgpa"
                                        class="bento-input"
                                        :value="mentee.past.sslc?.percentage" />
                                </div>
                            </div>
                        </div>

                        <!-- HSC Section -->
                        <div class="bg-nitMaroon-50 p-4 rounded-xl border border-nitMaroon-200">
                            <h3 class="text-sm font-bold text-gray-900 mb-3">HSC (12th)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label for="student_hsc_institution" class="block text-xs font-semibold text-gray-700 mb-1">Institution</label>
                                    <input type="text" name="student_hsc_institution" id="student_hsc_institution"
                                        class="bento-input"
                                        :value="mentee.past.hsc?.institution" />
                                </div>
                                <div>
                                    <label for="student_hsc_board" class="block text-xs font-semibold text-gray-700 mb-1">Board</label>
                                    <input type="text" name="student_hsc_board" id="student_hsc_board"
                                        class="bento-input"
                                        :value="mentee.past.hsc?.board_of_study" />
                                </div>
                                <div>
                                    <label for="student_hsc_year" class="block text-xs font-semibold text-gray-700 mb-1">Year</label>
                                    <input type="text" name="student_hsc_year" id="student_hsc_year"
                                        class="bento-input"
                                        :value="mentee.past.hsc?.year_of_study" />
                                </div>
                                <div>
                                    <label for="student_hsc_cgpa" class="block text-xs font-semibold text-gray-700 mb-1">Percentage</label>
                                    <input type="text" name="student_hsc_cgpa" id="student_hsc_cgpa"
                                        class="bento-input"
                                        :value="mentee.past.hsc?.percentage" />
                                </div>
                            </div>
                        </div>

                        <!-- JEE/UG Section -->
                        <div class="bg-nitMaroon-50 p-4 rounded-xl border border-nitMaroon-200">
                            <h3 class="text-sm font-bold text-gray-900 mb-3">{{ mentee.year == 'PG' ? 'UG Details' : 'JEE' }}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-if="mentee.year == 'PG'">
                                    <label for="student_ug_cgpa" class="block text-xs font-semibold text-gray-700 mb-1">UG CGPA</label>
                                    <input type="text" name="student_ug_cgpa" id="student_ug_cgpa"
                                        class="bento-input"
                                        :value="mentee.past.pg_feilds?.ug_cgpa" />
                                </div>
                                <div v-if="mentee.year == 'PG'">
                                    <label for="student_gate_score" class="block text-xs font-semibold text-gray-700 mb-1">GATE Score</label>
                                    <input type="text" name="student_gate_score" id="student_gate_score"
                                        class="bento-input"
                                        :value="mentee.past.pg_feilds?.gate_score" />
                                </div>
                                <div v-else>
                                    <label for="student_jee_rank" class="block text-xs font-semibold text-gray-700 mb-1">JEE Rank</label>
                                    <input type="text" name="student_jee_rank" id="student_jee_rank"
                                        class="bento-input"
                                        :value="mentee.past.jee?.rank" />
                                </div>
                                <div v-else>
                                    <label for="student_jee_score" class="block text-xs font-semibold text-gray-700 mb-1">JEE Score</label>
                                    <input type="text" name="student_jee_score" id="student_jee_score"
                                        class="bento-input"
                                        :value="mentee.past.jee?.score" />
                                </div>
                            </div>
                        </div>

                        <MiscMessage v-if="academicMessage.text" :type="academicMessage.type" class="text-sm">
                            {{ academicMessage.text }}
                        </MiscMessage>
                        <button type="submit" class="bento-button bg-nitMaroon-600 hover:bg-nitMaroon-700">
                            Save Changes
                        </button>
                    </form>
                </div>

            </div>
        </div>

        <div v-else class="flex items-center justify-center min-h-screen">
            <div class="bento-card bg-white border-2 border-nitMaroon-200 p-8 text-center">
                <div class="w-12 h-12 border-4 border-nitMaroon-200 border-t-nitMaroon-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-gray-700 font-semibold">Loading your profile...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Student } from "@/types/types.js"

definePageMeta({
    middleware: "level0"
})

const user = useUserStore()
let mentee = user.level === 0 && user.student && Object.keys(user.student).length
    ? user.student
    : await useMe()

if (mentee && typeof mentee !== "boolean") {
    // Keep store in sync after refresh or direct navigation.
    // @ts-ignore
    user.student.is_pg = mentee.year === "PG";
    // @ts-ignore
    user.student = mentee;
    user.level = 0;
    user.loggedIn = true;
    user.department = mentee.department?.name || "NONE";
}
const tempMentee = mentee;

if (!mentee) navigateTo("/login")

const specialFields = [
    "positions_of_responsibility",
    "scholarships",
    "competitions",
    "special_talents",
    "role_model",
    "objectives",
    "extra_curricular"
]

const specialMessage = ref({ type: "error", text: "" })
const basicMessage = ref({ type: "error", text: "" })
const personalMessage = ref({ type: "error", text: "" })
const fatherMessage = ref({ type: "error", text: "" })
const motherMessage = ref({ type: "error", text: "" })
const academicMessage = ref({ type: "error", text: "" })

const updateAcademic = async (e: Event) => {
    e.preventDefault();
    if (!mentee || typeof mentee === 'boolean') return false;

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Partial<Student> = {
        past: {
            sslc: {
                institution: formData.get("student_sslc_institution") as string,
                board_of_study: formData.get("student_sslc_board") as string,
                year_of_study: formData.get("student_sslc_year") as string,
                percentage: formData.get("student_sslc_cgpa") as string,
            },
            hsc: {
                institution: formData.get("student_hsc_institution") as string,
                board_of_study: formData.get("student_hsc_board") as string,
                year_of_study: formData.get("student_hsc_year") as string,
                percentage: formData.get("student_hsc_cgpa") as string,
            },
            jee: {
                rank: Number(formData.get("student_jee_rank") as string),
                score: Number(formData.get("student_jee_score") as string),
            },
            pg_feilds: {
                ug_cgpa: Number(formData.get("student_ug_cgpa") as string),
                gate_score: Number(formData.get("student_gate_score") as string),
                work_experience: formData.get("student_work_experience") as string,
            }
        },
    };

    if (data.past) mentee.past = data.past;
    
    await useFetch<{ token: string }>(`/api/students/me/past`, {
        method: "PATCH", body: JSON.stringify(data),
        onResponse() {
            academicMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            academicMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};

const updateSpecial = async (e: Event) => {
    e.preventDefault();
    if (!mentee || typeof mentee === 'boolean') return false;

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds: Student["achievements"] = {};
    for (const key of specialFields) {
        creds[key] = formData.get(key) as string || ""
    }

    mentee.achievements = creds;
    await useFetch<{ token: string }>(`/api/students/me/special`, {
        method: "PATCH", body: JSON.stringify(creds),
        onResponse() {
            specialMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            if (tempMentee && typeof tempMentee !== 'boolean') mentee.achievements = tempMentee.achievements;
            specialMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};

const updateBasic = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Partial<Student> = {
        year: formData.get("student_year") as string,
        batch: Number(formData.get("student_batch") as string),
        section: formData.get("student_section") as string,
    };

    if (mentee && typeof mentee !== 'boolean') {
        mentee.year = data.year || '';
        mentee.batch = data.batch ?? 0;
        mentee.section = data.section || '';
    }
    
    await useFetch<{ token: string }>(`/api/students/me/basic`, {
        method: "PATCH", body: JSON.stringify(data),
        onResponse() {
            basicMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            if (tempMentee && typeof tempMentee !== 'boolean') {
                mentee.year = tempMentee.year;
                mentee.batch = tempMentee.batch;
                mentee.section = tempMentee.section;
            }
            basicMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};

const updatePersonal = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Omit<Omit<Student["personal_info"], "father">, "mother"> = {
        blood_group: formData.get("student_blood") as string,
        mobile_number: formData.get("student_mobile") as string,
        whatsapp_number: formData.get("student_whatsapp") as string,
        date_of_birth: new Date(formData.get("student_date_of_birth") as string),
        gender: formData.get("student_gender") as string,
        email_id: formData.get("student_email_id") as string,
    };

    if (mentee && typeof mentee !== 'boolean') mentee.personal_info = data;
    
    await useFetch<{ token: string }>(`/api/students/me/personal`, {
        method: "PATCH", body: JSON.stringify(data),
        onResponse() {
            personalMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            if (tempMentee && typeof tempMentee !== 'boolean') mentee.personal_info = tempMentee.personal_info;
            personalMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};

const updateFather = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Student["personal_info"]["father"] = {
        name: formData.get("student_f_name") as string,
        occupation: formData.get("student_f_occupation") as string,
        mobile_number: formData.get("student_f_mobile") as string,
        whatsapp_number: formData.get("student_f_whatsapp") as string,
        email_id: formData.get("student_f_email_id") as string,
        address: formData.get("student_f_address") as string,
    };

    if (mentee && typeof mentee !== 'boolean') mentee.personal_info.father = data;
    
    await useFetch<{ token: string }>(`/api/students/me/father`, {
        method: "PATCH", body: JSON.stringify(data),
        onResponse() {
            fatherMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            if (tempMentee && typeof tempMentee !== 'boolean') mentee.personal_info.father = tempMentee.personal_info.father;
            fatherMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};

const updateMother = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Student["personal_info"]["mother"] = {
        name: formData.get("student_m_name") as string,
        occupation: formData.get("student_m_occupation") as string,
        mobile_number: formData.get("student_m_mobile") as string,
        whatsapp_number: formData.get("student_m_whatsapp") as string,
        email_id: formData.get("student_m_email_id") as string,
        address: formData.get("student_m_address") as string,
    };

    if (mentee && typeof mentee !== 'boolean') mentee.personal_info.mother = data;
    
    await useFetch<{ token: string }>(`/api/students/me/mother`, {
        method: "PATCH", body: JSON.stringify(data),
        onResponse() {
            motherMessage.value = { type: "success", text: "Updated details." };
        },
        onResponseError({ response }) {
            if (tempMentee && typeof tempMentee !== 'boolean') mentee.personal_info.mother = tempMentee.personal_info.mother;
            motherMessage.value = {
                type: "error",
                text: response.status === 401
                    ? "Not authenticated."
                    : response.status === 403
                        ? "Editing is disabled by your mentor."
                        : (response._data?.statusText || response._data?.statusMessage || "An unknown error occurred")
            };
        }
    })
};
</script>

<style scoped>
/* Dotted Background */
.dotted-bg {
    background-image: radial-gradient(circle, #e5d4d9 1px, transparent 1px);
    background-size: 20px 20px;
}

/* Bento Grid */
.bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (min-width: 1024px) {
    .bento-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Bento Card */
.bento-card {
    border-radius: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.bento-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Bento Input */
.bento-input {
    width: 100%;
    padding: 10px 14px;
    background-color: white;
    border: 2px solid #e5d4d9;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.bento-input:focus {
    outline: none;
    border-color: #a8304b;
    background-color: #fefefe;
}

 /* Bento Button */
.bento-button {
    padding: 10px 20px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.bento-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(168, 48, 75, 0.3);
}

.bento-button:active {
    transform: translateY(0px);
}
</style>
