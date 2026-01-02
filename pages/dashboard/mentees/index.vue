<template>
    <div class="min-h-screen bg-nitMaroon-50 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Your Mentees</h1>
                <p class="text-gray-600 mt-1">Manage mentee meetings and records</p>
            </div>

            <!-- Filters and Export -->
            <div class="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
                <div class="flex flex-col lg:flex-row gap-4 mb-4">
                    <input 
                        type="text" 
                        v-model="batch"
                        class="flex-1 px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        placeholder="Filter by batch" 
                    />
                    <input 
                        type="text" 
                        v-model="classSection"
                        class="flex-1 px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        placeholder="Filter by section" 
                    />
                    <input 
                        type="text" 
                        v-model="name"
                        class="flex-1 px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        placeholder="Filter by name" 
                    />
                    <input 
                        type="text" 
                        v-model="regNo"
                        class="flex-1 px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors"
                        placeholder="Filter by reg no" 
                    />
                </div>
                
                <!-- Results Count -->
                <div v-if="batch || classSection || name || regNo" class="text-sm text-gray-600 font-medium">
                    {{ computedMentees.length }} mentee{{ computedMentees.length !== 1 ? 's' : '' }} found
                </div>
                
                <div class="flex flex-wrap gap-3 items-center">
                    <select 
                        v-model="selectedMeetingNumber" 
                        class="flex-1 min-w-[200px] px-4 py-3 bg-yellow-50 border border-gray-300 rounded focus:bg-yellow-50 focus:border-gray-400 focus:outline-none transition-colors">
                        <option value="">Select Meeting Number</option>
                        <option v-for="meeting in meetingNumbers" :value="meeting.meeting_number">{{ meeting?.meeting_number }}</option>
                    </select>
                    <button 
                        :disabled="!selectedMeetingNumber"
                        @click="exportToPDF"
                        :class="['px-6 py-3 rounded font-medium transition-colors shadow-sm', selectedMeetingNumber ? 'bg-nitMaroon-600 hover:bg-nitMaroon-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed']">
                        Export to PDF
                    </button>
                    <span v-if="!selectedMeetingNumber" class="text-sm text-gray-500 italic">Select a meeting number first</span>
                </div>
            </div>

            <!-- Mentees List -->
            <div class="space-y-4">
                <EditableMentee v-for="mentee in computedMentees" :mentee="mentee" :key="mentee?.meeting_number" />
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
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.mentor?.department}}</span></div>
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
        <!-- End of PDF Template -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
    middleware: ["level1"]
});

const mentees = await useMentee();
const meetingNumbers:any = await useMeetings(mentees[0]?.mentor?.id);

const selectedMeetingNumber = ref("");
const meetings = ref();

watch(selectedMeetingNumber, async (newMeetingNumber: string) => {
    if (newMeetingNumber) {
        meetings.value = await useMeetingsNumber(parseInt(newMeetingNumber)) || [];
    } else {
        meetings.value = [];
    }
});

const computedMentees = computed(() => {
    return !expandFilter.value ? mentees :
        mentees.filter(x => {
            return (
                (batch.value ? x.batch.toString().startsWith(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value.toUpperCase() : true) &&
                (name.value ? x.name.toLowerCase().includes(name.value.toLowerCase()) : true) &&
                (regNo.value ? x.register_number.startsWith(regNo.value) : true)
            );
        });
});

const batch = ref("");
const name = ref("");
const regNo = ref("");
const classSection = ref("");
const pdfContainer = ref("");
const expandFilter = ref(false);
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
