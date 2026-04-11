<template>
    <div :class="`p-2 flex flex-col items-stretch`">
        <div class="rounded-2xl border border-nitMaroon-200 bg-white/90 backdrop-blur shadow-sm overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-nitMaroon-600 via-nitMaroon-400 to-nitMaroon-200"></div>
            <div class="p-4 md:p-5 flex items-center justify-between gap-3">
                <div class="flex items-center gap-4 md:gap-6 min-w-0">
                    <div class="flex flex-col items-start gap-2" title="Allow Editing">
                        <MiscSwitch :turned-on="mentee.enable_edit_profile ?? true" @update="toggleEditProfile" />
                        <span
                            :class="`${mentee.enable_edit_profile ? 'bg-green-100 text-green-800 border-green-300' : 'bg-zinc-200 text-zinc-700 border-zinc-300'} text-[11px] font-semibold px-2 py-0.5 rounded-full border`">
                            {{ mentee.enable_edit_profile ? 'Edit Enabled' : 'Edit Locked' }}
                        </span>
                    </div>
                    <div class="min-w-0">
                        <div class="text-xl md:text-2xl font-semibold text-gray-900 truncate">{{ mentee.name }}</div>
                        <div class="text-sm md:text-base text-gray-600 font-medium">#{{ mentee.register_number }}</div>
                        <div class="mt-2 flex flex-wrap gap-2 text-xs">
                            <span class="px-2 py-1 rounded-full bg-nitMaroon-50 text-nitMaroon-700 border border-nitMaroon-200 font-semibold">
                                {{ mentee.year }}
                            </span>
                            <span v-if="mentee.batch" class="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                                Batch {{ mentee.batch }}
                            </span>
                            <span v-if="mentee.section" class="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                                Section {{ mentee.section }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <a :href="`/dashboard/mentees/${mentee.register_number}/meetings`"
                        class="hidden sm:flex items-center gap-2 bg-nitMaroon-700 hover:bg-nitMaroon-800 text-rose-50 rounded-lg py-2.5 px-4 transition-colors">
                        <span class="text-sm font-medium">Check Meeting Details</span>
                        <svg class="block w-5 h-5 stroke-2 stroke-rose-100"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                stroke-linejoin="round" :d="`${AllIcons.userplus}`" />
                        </svg>
                    </a>
                    <button @click="toggleDrop" class="p-2 rounded-lg hover:bg-nitMaroon-50 transition-colors">
                        <svg class="h-8 w-8 stroke-nitMaroon-600 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 30 24" aria-hidden="true">
                            <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                stroke-linejoin="round" :d="editOpen
                                    ? `M 18 15 L 12 9 L 6 15` : `M 6 9 L 12 15 L 18 9`" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="px-4 pb-4 sm:hidden">
                <a :href="`/dashboard/mentees/${mentee.register_number}/meetings`"
                    class="inline-flex items-center gap-2 bg-nitMaroon-700 hover:bg-nitMaroon-800 text-rose-50 rounded-lg py-2 px-3 transition-colors">
                    <span class="text-sm font-medium">Check Meeting Details</span>
                    <svg class="block w-5 h-5 stroke-2 stroke-rose-100"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                            stroke-linejoin="round" :d="`${AllIcons.userplus}`" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="mentee-edit-panel"
            :class="`${editOpen ? `max-h-[999rem]` : `max-h-[0rem]`} overflow-y-hidden transition-all duration-1000 ease-in-out bg-white/75 border-x border-b border-nitMaroon-200 rounded-b-2xl flex flex-col space-y-4`">
            <div class="p-2">
                <div class="sticky top-0 z-10 bg-white/90 backdrop-blur border border-nitMaroon-200 rounded-xl p-2 mb-4">
                    <div class="flex flex-wrap gap-2">
                        <button v-for="tab in sectionTabs" :key="tab.key" @click="activeTab = tab.key"
                            :class="`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeTab === tab.key ? 'bg-nitMaroon-700 text-white' : 'bg-white text-nitMaroon-700 border border-nitMaroon-200 hover:bg-nitMaroon-50'}`">
                            {{ tab.label }}
                        </button>
                    </div>
                </div>

                <MiscMessage
                    :class="`${toggleMessage.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full lg:w-96 mx-auto`"
                    :type="toggleMessage.type">
                    {{ toggleMessage.text }}
                </MiscMessage>

                <!-- BASIC STUDENT INFO -->
                <div v-show="activeTab === 'basic'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Basic Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateBasic(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_batch">Batch</label>
                            <input type="number" name="student_batch" id="student_batch" class="font-semibold p-2 w-48"
                                :value="mentee.batch" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_year">Course</label>
                            <!-- <input type="number" name="student_year" id="student_year" class="font-semibold p-2 w-48"
                                :value="mentee.year" /> -->
                            <select name="student_year" class="font-semibold p-2 w-48" id="student_year">
                                <option value="" hidden>{{ mentee.year }}</option>
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_section">Section</label>
                            <input type="text" name="student_section" id="student_section"
                                class="font-semibold p-2 w-48" :value="mentee.section" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${basicMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="basicMessage.type">
                        {{ basicMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Basic Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />
                </div>

                <!-- STUDENT PERSONAL INFO -->
                <div v-show="activeTab === 'personal'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Personal Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updatePersonal(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_blood">Blood Group</label>
                            <input type="text" name="student_blood" id="student_blood" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.blood_group" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_mobile">Mobile Number</label>
                            <input type="text" name="student_mobile" id="student_mobile" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_whatsapp" id="student_whatsapp"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_date_of_birth">Date Of Birth</label>
                            <input type="date" name="student_date_of_birth" id="student_date_of_birth"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.date_of_birth" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_gender">Gender</label>
                            <select name="student_gender" id="student_gender" class="font-semibold p-2 w-48">
                                <option value="male" :selected="mentee.personal_info.gender === `male`">Male</option>
                                <option value="female" :selected="mentee.personal_info.gender === `female`">Female
                                </option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_email_id">Email ID</label>
                            <input type="email" name="student_email_id" id="student_email_id"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.email_id" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${personalMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="personalMessage.type">
                        {{ personalMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Personal Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />
                </div>

                <!-- STUDENT FATHER INFO -->
                <div v-show="activeTab === 'father'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Father Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateFather(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_name">Name</label>
                            <input type="text" name="student_f_name" id="student_f_name" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.father?.name" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_occupation">Occupation</label>
                            <input type="text" name="student_f_occupation" id="student_f_occupation"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.occupation" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_mobile">Mobile Number</label>
                            <input type="text" name="student_f_mobile" id="student_f_mobile"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_f_whatsapp" id="student_f_whatsapp"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_email_id">Email ID</label>
                            <input type="email" name="student_f_email_id" id="student_f_email_id"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.email_id" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_address">Address</label>
                            <input type="text" name="student_f_address" id="student_f_address"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.address" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${fatherMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="fatherMessage.type">
                        {{ fatherMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Father Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />
                </div>

                <!-- STUDENT MOTHER INFO -->
                <div v-show="activeTab === 'mother'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Mother Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateMother(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_name">Name</label>
                            <input type="text" name="student_m_name" id="student_m_name" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.mother?.name" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_occupation">Occupation</label>
                            <input type="text" name="student_m_occupation" id="student_m_occupation"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.occupation" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_mobile">Mobile Number</label>
                            <input type="text" name="student_m_mobile" id="student_m_mobile"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_m_whatsapp" id="student_m_whatsapp"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_email_id">Email ID</label>
                            <input type="email" name="student_m_email_id" id="student_m_email_id"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.email_id" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_address">Address</label>
                            <input type="text" name="student_m_address" id="student_m_address"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.address" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${motherMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="motherMessage.type">
                        {{ motherMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Mother Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" /> <!-- SPECIAL ACHIEVEMENT INFO -->
                </div>

                <div v-show="activeTab === 'special'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Achievements / Special Info</h2>
                <form class="flex flex-col items-center gap-4 pt-8" @submit="e => updateSpecial(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div v-for="field in specialFields" :key="field" class="flex flex-col items-center gap-2">
                            <label :htmlFor="field" class="w-full text-start">
                                {{field.split("_").map(x => x.slice(0, 1).toUpperCase() + x.slice(1)).join(" ")}}
                            </label>
                            <textarea :name="field" :id="field" :value="mentee.achievements[field]"
                                class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${specialMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="specialMessage.type">
                        {{ specialMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Special Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" /> <!-- ACADEMIC INFO -->
                </div>

                <div v-show="activeTab === 'academic'">
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Academic Qualifications </h2>
                <form class="flex flex-col items-center gap-4 pt-8" @submit="e => updateAcademic(e)">
                    <div class="font-bold text-xl uppercase">sslc(10th)</div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_sslc_institution">Institution</label>
                            <input type="text" name="student_sslc_institution" id="student_sslc_institution"
                                class="font-semibold p-2 w-72" :value="mentee.past.sslc?.institution" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_sslc_board">Board of Study</label>
                            <input type="text" name="student_sslc_board" id="student_sslc_board"
                                class="font-semibold p-2 w-72" :value="mentee.past.sslc?.board_of_study" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_sslc_year">Year(s) of Study</label>
                            <input type="text" name="student_sslc_year" id="student_sslc_year"
                                class="font-semibold p-2 w-72" :value="mentee.past.sslc?.year_of_study" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_sslc_cgpa">CGPA / Percentage</label>
                            <input type="text" name="student_sslc_cgpa" id="student_sslc_cgpa"
                                class="font-semibold p-2 w-72" :value="mentee.past.sslc?.percentage" />
                        </div>
                    </div>
                    <div class="font-bold text-xl uppercase">hsc(12th)</div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_hsc_institution">Institution</label>
                            <input type="text" name="student_hsc_institution" id="student_hsc_institution"
                                class="font-semibold p-2 w-72" :value="mentee.past.hsc?.institution" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_hsc_board">Board of Study</label>
                            <input type="text" name="student_hsc_board" id="student_hsc_board"
                                class="font-semibold p-2 w-72" :value="mentee.past.hsc?.board_of_study" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_hsc_year">Year(s) of Study</label>
                            <input type="text" name="student_hsc_year" id="student_hsc_year"
                                class="font-semibold p-2 w-72" :value="mentee.past.hsc?.year_of_study" />
                        </div>
                        <div class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_hsc_cgpa">CGPA / Percentage</label>
                            <input type="text" name="student_hsc_cgpa" id="student_hsc_cgpa"
                                class="font-semibold p-2 w-72" :value="mentee.past.hsc?.percentage" />
                        </div>
                    </div>
                    <div v-if="mentee.year != 'PG'" class="font-bold text-xl uppercase">jee</div>
                    <div v-if="mentee.year == 'PG'" class="font-bold text-xl uppercase">UG Details</div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div v-if="mentee.year == 'PG'" class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_ug_cgpa">UG CGPA</label>
                            <input type="text" name="student_ug_cgpa" id="student_ug_cgpa"
                                class="font-semibold p-2 w-60" :value="mentee.past.pg_feilds?.ug_cgpa" />
                        </div>
                        <div v-if="mentee.year == 'PG'" class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_gate_score">GATE Score</label>
                            <input type="text" name="student_gate_score" id="student_gate_score"
                                class="font-semibold p-2 w-60" :value="mentee.past.pg_feilds?.gate_score" />
                        </div>
                        <div v-else class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_jee_rank">Rank</label>
                            <input type="text" name="student_jee_rank" id="student_jee_rank"
                                class="font-semibold p-2 w-60" :value="mentee.past.jee?.rank" />
                        </div>
                        <div v-else class="flex flex-col items-center max-w-xs gap-2">
                            <label for="student_jee_score">Score</label>
                            <input type="text" name="student_jee_score" id="student_jee_score"
                                class="font-semibold p-2 w-60" :value="mentee.past.jee?.score" />
                        </div>

                    </div>
                    <MiscMessage
                        :class="`${academicMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="academicMessage.type">
                        {{ academicMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Update Academic Info
                    </button>
                </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Student } from "@/types/types.js"
const { mentee } = defineProps<{ mentee: Student }>()
const tempMentee = mentee
const editOpen = ref(false)

const specialMessage = ref({ type: "error", text: "" })
const basicMessage = ref({ type: "error", text: "" })
const personalMessage = ref({ type: "error", text: "" })
const fatherMessage = ref({ type: "error", text: "" })
const motherMessage = ref({ type: "error", text: "" })
const academicMessage = ref({ type: "error", text: "" })
const toggleMessage = ref({ type: "info", text: "" })
const activeTab = ref("basic")

const sectionTabs = [
    { key: "basic", label: "Basic" },
    { key: "personal", label: "Personal" },
    { key: "father", label: "Father" },
    { key: "mother", label: "Mother" },
    { key: "special", label: "Special" },
    { key: "academic", label: "Academic" },
]

const toggleDrop = () => editOpen.value = !editOpen.value
const updateAcademic = async (e: Event) => {
    e.preventDefault();
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
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    if (data.past) {
        mentee.past = data.past;
    }

    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/past`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            academicMessage.value.type = "success"
            academicMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            // mentee.personal_info=tempMentee.personal_info
            academicMessage.value.type = "error"    
            switch (response.status) {
                case 400:
                    // this won't happen
                    academicMessage.value.text = "Missing Fields."
                case 401:
                    academicMessage.value.text = "Cant Grant the access"
                    break;
                default:
                    academicMessage.value.text = "An unknown error occurred";
                    
                    break;
            }
        }
    })
};
const updateSpecial = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds: Student["achievements"] = {};
    for (const key of specialFields) {
        creds[key] = formData.get(key) as string || ""
    }
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    mentee.achievements = creds
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/special`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            specialMessage.value.type = "success"
            specialMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            mentee.achievements = tempMentee.achievements
            specialMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    specialMessage.value.text = "Missing Fields."
                case 401:
                    specialMessage.value.text = "Can't grant the access"
                    break;
                default:
                    specialMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};

const toggleEditProfile = async (val: boolean) => {
    const previous = mentee.enable_edit_profile;
    mentee.enable_edit_profile = val;

    try {
        await $fetch(`/api/mentees/update/${mentee.register_number}/editable`, {
            method: "PATCH",
            body: { value: val },
        });
        toggleMessage.value.type = "info";
        toggleMessage.value.text = val ? "Edit access enabled." : "Edit access disabled.";
    } catch (error: any) {
        mentee.enable_edit_profile = previous;
        toggleMessage.value.type = "error";
        toggleMessage.value.text = error?.data?.statusText || error?.data?.statusMessage || "Unable to toggle editing.";
    }

    setTimeout(() => {
        toggleMessage.value.text = "";
    }, 2200);
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
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    if (data.year) {
        mentee.year = data.year
    }
    if (data.batch) {
        mentee.batch = data.batch
    }
    if (data.section) {
        mentee.section = data.section
    }
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/basic`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            basicMessage.value.type = "success"
            basicMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            mentee.year = tempMentee.year
            mentee.batch = tempMentee.batch
            mentee.section = tempMentee.section
            basicMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    basicMessage.value.text = "Missing Fields."
                case 401:
                    basicMessage.value.text = "Can't grant the access"
                    break;
                default:
                    basicMessage.value.text = "An unknown error occurred";
                    break;
            }
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
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    mentee.personal_info = data
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/personal`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            personalMessage.value.type = "success"
            personalMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            mentee.personal_info = tempMentee.personal_info
            personalMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    personalMessage.value.text = "Missing Fields."
                case 401:
                    personalMessage.value.text = "Can't grant the access."
                    break;
                default:
                    personalMessage.value.text = "An unknown error occurred";
                    break;
            }
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
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    mentee.personal_info.father = data
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/father`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            fatherMessage.value.type = "success"
            fatherMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            mentee.personal_info.father = tempMentee.personal_info.father
            fatherMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    fatherMessage.value.text = "Missing Fields."
                case 401:
                    fatherMessage.value.text = "Can't grant the access."
                    break;
                default:
                    fatherMessage.value.text = "An unknown error occurred";
                    break;
            }
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
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    mentee.personal_info.mother = data
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/mother`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            motherMessage.value.type = "success"
            motherMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            mentee.personal_info.mother = tempMentee.personal_info.mother
            motherMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    motherMessage.value.text = "Missing Fields."
                case 401:
                    motherMessage.value.text = "Can't grant the access."
                    break;
                default:
                    motherMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};
</script>

<style scoped>
.mentee-edit-panel input,
.mentee-edit-panel select,
.mentee-edit-panel textarea {
    background-color: #ffffff;
    border: 2px solid #d6c0c7;
    border-radius: 0.5rem;
    color: #111827;
    box-shadow: 0 1px 2px rgba(17, 24, 39, 0.08);
}

.mentee-edit-panel input:focus,
.mentee-edit-panel select:focus,
.mentee-edit-panel textarea:focus {
    outline: none;
    border-color: #8d2a40;
    box-shadow: 0 0 0 3px rgba(141, 42, 64, 0.2);
}

.mentee-edit-panel input::placeholder,
.mentee-edit-panel textarea::placeholder {
    color: #6b7280;
}

.mentee-edit-panel label {
    color: #374151;
    font-weight: 600;
}
</style>