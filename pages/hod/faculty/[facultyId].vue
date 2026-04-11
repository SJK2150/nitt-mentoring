<template>
    <div class="min-h-screen bg-nitMaroon-50 p-6 relative">
        <MiscGeometricBg />
        <div class="max-w-7xl mx-auto relative z-10">
            <!-- Faculty Info Card -->
            <div v-if="faculty" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-nitMaroon-200 mb-6 animate-slide-up">
                <!-- Header Banner -->
                <div class="h-24 bg-gradient-to-r from-nitMaroon-600 via-nitMaroon-700 to-nitMaroon-800 relative">
                    <div class="absolute inset-0 bg-black/10"></div>
                </div>
                
                <!-- Content -->
                <div class="relative px-8 pt-0 pb-6">
                    <!-- Avatar Badge -->
                    <div class="absolute -top-12 left-8">
                        <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-nitMaroon-600 to-nitMaroon-800 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-white">
                            {{ faculty.name.charAt(0).toUpperCase() }}
                        </div>
                    </div>
                    
                    <!-- Faculty Info -->
                    <div class="pt-16">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ faculty.name }}</h1>
                                <p class="text-gray-600 text-sm mb-4">Managing mentor assignments</p>
                                <div class="inline-flex items-center gap-2 px-4 py-2 bg-nitMaroon-50 rounded-lg border border-nitMaroon-200">
                                    <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span class="text-sm font-semibold text-gray-700">Total Mentees:</span>
                                    <span class="text-lg font-bold text-nitMaroon-700">{{ faculty.mentees.length }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions Bar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6 animate-slide-up">
                <button 
                    @click="pushChanges"
                    class="px-6 py-3 bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white font-semibold rounded-lg transition-colors duration-300">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Commit Changes
                    </span>
                </button>
                
                <button 
                    @click="_ => expandFilter = !expandFilter"
                    class="px-6 py-3 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        {{ expandFilter ? 'Hide' : 'Show' }} Filters
                    </span>
                </button>
            </div>
            
            <!-- Filter Section -->
            <div
                :class="`${expandFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-500 ease-in-out mb-6`">
                <div class="bg-white rounded-2xl shadow-md p-6 border border-nitMaroon-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter Students
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1.5">Batch</label>
                            <input type="text" v-model="batch"
                                class="w-full px-4 py-2.5 rounded-lg bg-yellow-50 border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none text-sm"
                                placeholder="2020, 2021..." />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1.5">Section</label>
                            <input type="text" v-model="classSection"
                                class="w-full px-4 py-2.5 rounded-lg bg-yellow-50 border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none text-sm"
                                placeholder="A, B, C..." />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                            <input type="text" v-model="name"
                                class="w-full px-4 py-2.5 rounded-lg bg-yellow-50 border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none text-sm"
                                placeholder="Student name..." />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1.5">Registration No.</label>
                            <input type="text" v-model="regNo"
                                class="w-full px-4 py-2.5 rounded-lg bg-yellow-50 border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none text-sm"
                                placeholder="106..." />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Export Section -->
            <div class="bg-white rounded-2xl shadow-md p-6 border border-nitMaroon-200 mb-6 animate-slide-up" style="animation-delay: 0.1s">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-nitMaroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Meeting Report
                </h3>
                <div class="flex flex-col md:flex-row items-end gap-4">
                    <div class="flex-1 w-full">
                        <label class="block text-xs font-medium text-gray-600 mb-1.5">Select Meeting</label>
                        <select v-model="selectedMeetingNumber" 
                            class="w-full px-4 py-2.5 rounded-lg bg-yellow-50 border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none text-sm">
                            <option value="">Choose a meeting number</option>
                            <option v-for="(meeting, index) in meetingNumbers" :key="index" :value="meeting.meeting_number">
                                Meeting #{{ meeting?.meeting_number }}
                            </option>
                        </select>
                    </div>
                    <button 
                        :disabled="!selectedMeetingNumber" 
                        @click="exportToPDF"
                        :class="[
                            'px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm',
                            !selectedMeetingNumber 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:from-blue-700 hover:to-blue-800'
                        ]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </button>
                </div>
            </div>
            
            <MiscMessage :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 mb-4`"
                :type="message.type">
                {{ message.text }}
            </MiscMessage>
            
            <!-- Students Table -->
            <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-nitMaroon-200 animate-slide-up" style="animation-delay: 0.2s">
                <div class="px-6 py-4 bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700">
                    <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Student Assignment ({{ computedMentees.length }} students)
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="table-auto border-collapse w-full">
                        <thead class="bg-gray-50 border-y border-gray-200">
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Assign</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reg. No.</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Section</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Mentor</th>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="mentee in computedMentees" :key="mentee.register_number"
                                class="hover:bg-nitMaroon-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <input type="checkbox" 
                                        :checked="mentee.mentor_id === Number(facultyId)"
                                        :disabled="Boolean(mentee.mentor_id && mentee.mentor_id !== -1 && (mentee.mentor_id !== Number(facultyId)))"
                                        @change="e => updateMentor(e, mentee.register_number)"
                                        class="w-5 h-5 text-nitMaroon-600 rounded border-gray-300 focus:ring-nitMaroon-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                                </td>
                                <td class="px-6 py-4">
                                    <a :href="`/dashboard/mentees/${mentee.register_number}/meetings`" 
                                        class="inline-flex items-center gap-1.5 text-sm font-medium text-nitMaroon-600 hover:text-nitMaroon-700 hover:underline">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </a>
                                </td>
                                <td class="px-6 py-4 text-sm font-mono font-medium text-gray-900">{{ mentee.register_number }}</td>
                                <td class="px-6 py-4 text-sm text-gray-900">{{ mentee.name }}</td>
                                <td class="px-6 py-4">
                                    <span :class="[
                                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                        mentee.year === 'UG' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                    ]">
                                        {{ mentee.year }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ mentee.year === 'UG' ? (mentee.section || 'N/A') : 'N/A' }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ mentee.mentor?.name }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        <!-- Start of PDF Template -->
        <div ref="pdfContainer" :style="{ visibility: exportToPdfMode ? 'visible' : 'hidden' }">
            <div class="flex items-center justify-center gap-4 mb-3">
                <img src="/nitt_logo_min.webp" class="w-20 h-20" />
                <h1 class="text-lg lg:text-3xl font-bold pb-6">National Institute of Technology Tiruchirappalli</h1>
            </div>
            <hr class="bg-black h-[3px]"/>
            <div class="flex gap-6 items-center justify-center pt-4">
                <h1 class="text-xl lg:text-2xl font-bold pb-6">Mentor-Mentee Meeting #{{selectedMeetingNumber}}</h1>
            </div>
            <div class="flex gap-6 items-center pb-2 pt-2 font-semibold">
                <div class="w-1/2 flex">
                    <div class="w-40">Faculty Name</div>
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.mentor?.name}}</span></div>
                </div>
                <div class="w-1/2 flex">
                    <div class="w-40">Department</div>
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.department}}</span></div>
                </div>
            </div>
            <table class="w-full border-collapse border border-gray-700 mt-5">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="px-4 py-2 text-left border-r border-gray-700">Sl. No</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Reg. No</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Name</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Discussion</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(meeting, index) in meetings" :key="meeting.meeting_number" class="border-t border-gray-700">
                        <td class="px-4 py-2 border-r border-gray-700">{{ index + 1 }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.mentee?.register_no }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.mentee?.name }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.discussion }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ new Date(meeting?.date).toLocaleDateString('en-GB') }}</td> 
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        "level2"
    ]
})

const route = useRoute()
const router = useRouter()
const facultyId = route.params.facultyId;
const faculty = await useFaculty(Number(facultyId))

const mentees = ((await useSudoMentee()) || []).map(mentee => ({ ...mentee, mentor: mentee.mentor || { name: "Not Assigned" } }))
const filteredMentees = mentees.filter(mentee => mentee.mentor_id === Number(facultyId) || mentee.mentor_id === null);

if (!faculty) nextTick(() => router.go(-1))
else mentees?.sort((a, b) => a.mentor_id === faculty.id && b.mentor_id !== faculty.id ? -1 : a.mentor_id !== faculty.id && b.mentor_id === faculty.id ? 1 : 0)

const menteeMap = new Map<string, number>();

mentees?.forEach(mentee => menteeMap.set(mentee.register_number, mentee.mentor_id || -1));

const updateMentor = async (e: Event, regno: string) => {
    const box = e.currentTarget as HTMLInputElement;
    const mentor_id = box.checked ? Number(facultyId) : -1
    menteeMap.set(regno, mentor_id);
}

const pushChanges = async () => {
    let successes = 0;
    const failed: string[] = [];

    for (const [mtee, mtor] of menteeMap.entries()) {
        const currentMentor = mentees.find(x => x.register_number === mtee)?.mentor_id;
        if (mtor === currentMentor) continue;

        try {
            await $fetch(`/api/mentees/${mtee}`, {
                method: "PATCH",
                body: { mentor_id: mtor },
            });
            successes += 1;
        } catch (_err) {
            failed.push(mtee);
        }
    }

    if (failed.length > 0) {
        message.value.type = "error";
        message.value.text = successes > 0
            ? `Mentor updated for ${successes} students. Failed for: ${failed.join(", ")}`
            : `Unable to change mentor for: ${failed.join(", ")}`;
    } else {
        message.value.type = "success";
        message.value.text = `Mentor for ${successes} students changed!`;
    }

    if (successes > 0) {
        setTimeout(() => router.go(0), 1200);
    }
}

const computedMentees = computed(() => {
    return !expandFilter.value ? filteredMentees :
        filteredMentees.filter(x => {
            return (
                (batch.value ? String(x.batch || "").startsWith(batch.value) : true) &&
                (classSection.value ? (x.section || "").toUpperCase() === classSection.value.toUpperCase() : true)&&
                (name.value ? x.name.toLowerCase().includes(name.value.toLowerCase()):true) &&
                (regNo.value ? x.register_number.startsWith(regNo.value):true)
            )
        })
})


const name=ref("")
const batch=ref("")
const regNo=ref("")
const classSection = ref("")
const expandFilter = ref(false)
const message = ref({ text: "", type: 'success' })

const selectedMeetingNumber = ref("");
const meetings = ref();
const meetingNumbers:any = await useMeetings(Number(facultyId));

watch(selectedMeetingNumber, async (newMeetingNumber: string) => {
    if (newMeetingNumber) {
        meetings.value = await useMeetingsNumber(parseInt(newMeetingNumber)) || [];
    } else {
        meetings.value = [];
    }
});
</script>

<script lang="ts">
const exportToPdfMode = ref(false);

export default {
    name: 'app',
    methods: {
        exportToPDF() {
            if (typeof window !== 'undefined') {
                exportToPdfMode.value = true;
                const filename = `Mentor_Mentee_Meeting_List.pdf`;
                import('html2pdf.js').then((html2pdf) => {
                    html2pdf.default(this.$refs.pdfContainer, {
                        margin: 0.7,
                        filename: filename,
                        image: { type: 'jpeg', quality: 1 },
                        html2canvas: { dpi: 192, letterRendering: true },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
                    });
                    exportToPdfMode.value = false;
                }).catch(error => {
                    console.error('Failed to load html2pdf:', error);
                    exportToPdfMode.value = false;
                });
            } else {
                console.error('Cannot export to PDF: window is not defined.');
            }
        }
    }
}
</script>
