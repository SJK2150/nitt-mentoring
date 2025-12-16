<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div class="max-w-7xl mx-auto">
            <InfoMentor v-if="faculty" :mentor="{ ...faculty, menteeCount: faculty.mentees.length }" />
            
            <!-- Actions Bar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6 animate-slide-up">
                <button 
                    @click="pushChanges"
                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
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
                <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input type="text" v-model="batch"
                            class="px-4 py-3 rounded-xl border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
                            placeholder="Filter by Batch" />
                        <input type="text" v-model="classSection"
                            class="px-4 py-3 rounded-xl border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
                            placeholder="Filter by Section" />
                        <input type="text" v-model="name"
                            class="px-4 py-3 rounded-xl border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
                            placeholder="Filter by Name" />
                        <input type="text" v-model="regNo"
                            class="px-4 py-3 rounded-xl border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none"
                            placeholder="Filter by Reg No" />
                    </div>
                </div>
            </div>
            <!-- Export Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6 animate-slide-up" style="animation-delay: 0.1s">
                <div class="flex flex-col md:flex-row items-center gap-4">
                    <select v-model="selectedMeetingNumber" 
                        class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-nitMaroon-500 focus:ring-2 focus:ring-nitMaroon-200 transition-all outline-none">
                        <option value="">Select Meeting Number</option>
                        <option v-for="(meeting, index) in meetingNumbers" :key="index" :value="meeting.meeting_number">
                            Meeting #{{ meeting?.meeting_number }}
                        </option>
                    </select>
                    <button 
                        :disabled="!selectedMeetingNumber" 
                        @click="exportToPDF"
                        :class="[
                            'px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300',
                            !selectedMeetingNumber 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md'
                        ]">
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export to PDF
                        </span>
                    </button>
                </div>
            </div>
            
            <MiscMessage :class="`${message.text ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 mb-4`"
                :type="message.type">
                {{ message.text }}
            </MiscMessage>
            
            <!-- Students Table -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-slide-up" style="animation-delay: 0.2s">
            <table class="table-auto border-collapse w-full">
            <thead class="bg-gradient-to-r from-nitMaroon-600 to-nitMaroon-700 text-white">
                <th class="px-4 py-4 text-left font-semibold">Assigned</th>
                <th class="px-4 py-4 text-left font-semibold">Meetings</th>
                <th class="px-4 py-4 text-left font-semibold">Reg #</th>
                <th class="px-4 py-4 text-left font-semibold">Name</th>
                <th class="px-4 py-4 text-left font-semibold">Year</th>
                <th class="px-4 py-4 text-left font-semibold">Section</th>
                <th class="px-4 py-4 text-left font-semibold">Mentor</th>
            </thead>
            <tbody>
                <tr v-for="mentee in computedMentees" :key="mentee.register_number"
                    class="text-sm border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-4">
                        <input type="checkbox" 
                            :checked="mentee.mentor_id === Number(facultyId)"
                            :disabled="Boolean(mentee.mentor_id && mentee.mentor_id !== -1 && (mentee.mentor_id !== Number(facultyId)))"
                            @change="e => updateMentor(e, mentee.register_number)"
                            class="w-4 h-4 text-nitMaroon-600 rounded focus:ring-nitMaroon-500" />
                    </td>
                    <td class="px-4 py-4">
                        <a :href="`/dashboard/mentees/${mentee.register_number}/meetings`" 
                            class="text-nitMaroon-600 hover:text-nitMaroon-700 font-semibold hover:underline">
                            View Details
                        </a>
                    </td>
                    <td class="px-4 py-4 font-medium">{{ mentee.register_number }}</td>
                    <td class="px-4 py-4">{{ mentee.name }}</td>
                    <td class="px-4 py-4">{{ mentee.year }}</td>
                    <td class="px-4 py-4">{{ mentee.section }}</td>
                    <td class="px-4 py-4 text-gray-600">{{ mentee.mentor?.name }}</td>
                </tr>
            </tbody>
        </table>
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

const auth = useCookie<string>("nitt_token")
const route = useRoute()
const router = useRouter()
const facultyId = route.params.facultyId;
const faculty = await useFaculty(Number(facultyId))

const mentees = (await useSudoMentee())?.map(mentee => ({ ...mentee, mentor: mentee.mentor || { name: "Not Assigned" } }))
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
    for await (const [mtee, mtor] of menteeMap.entries()) {
        if (mtor !== mentees.find(x => x.register_number === mtee)?.mentor_id) {
            await useFetch<{ token: string }>(`/api/mentees/${mtee}`, {
                method: "PATCH", body: JSON.stringify({ mentor_id: mtor }),
                headers: { "Authorization": `Bearer ${auth.value}` },
                onResponse({ request, response, options }) {
                    successes += 1;
                },
                onResponseError({ request, response, options }) {
                    message.value.type = "error"
                    message.value.text = `Unable to change mentor for ${mtee}!`
                    successes -= 1;
                }
            })
        }
    }
    message.value.type = "success"
    message.value.text = `Mentor for ${successes} students changed!`
    setTimeout(() => router.go(0), 3000)
}

const computedMentees = computed(() => {
    return !expandFilter.value ? filteredMentees :
        filteredMentees.filter(x => {
            return (
                (batch.value ? x.batch.toString().startsWith(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value.toUpperCase() : true)&&
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
