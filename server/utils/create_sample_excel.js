import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample UG students
const ugStudents = [
  {
    name: "Rajesh Kumar",
    regno: "106123001",
    password: "Welcome123",
    department: "CSE",
    year: "UG",
    batch: 2023,
    section: "A"
  },
  {
    name: "Priya Sharma",
    regno: "106123002",
    password: "Welcome123",
    department: "CSE",
    year: "UG",
    batch: 2023,
    section: "A"
  },
  {
    name: "Amit Patel",
    regno: "106123003",
    password: "Welcome123",
    department: "CSE",
    year: "UG",
    batch: 2023,
    section: "B"
  },
  {
    name: "Sneha Reddy",
    regno: "106123004",
    password: "Welcome123",
    department: "ECE",
    year: "UG",
    batch: 2024,
    section: "A"
  },
  {
    name: "Vikram Singh",
    regno: "106123005",
    password: "Welcome123",
    department: "MECH",
    year: "UG",
    batch: 2024,
    section: "C"
  }
];

// Sample PG students
const pgStudents = [
  {
    name: "Dr. Anjali Verma",
    regno: "206123001",
    password: "Welcome123",
    department: "CSE",
    year: "PG",
    ugCGPA: 8.5,
    gateScore: 650,
    workExperience: "2 years at TCS"
  },
  {
    name: "Karthik Menon",
    regno: "206123002",
    password: "Welcome123",
    department: "CSE",
    year: "PG",
    ugCGPA: 9.1,
    gateScore: 720,
    workExperience: "3 years at Infosys"
  },
  {
    name: "Meera Krishnan",
    regno: "206123003",
    password: "Welcome123",
    department: "ECE",
    year: "PG",
    ugCGPA: 8.8,
    gateScore: 680,
    workExperience: "1 year at Wipro"
  }
];

// Create workbook with two sheets
const wb = XLSX.utils.book_new();

// Add UG students sheet
const wsUG = XLSX.utils.json_to_sheet(ugStudents);
XLSX.utils.book_append_sheet(wb, wsUG, "UG Students");

// Add PG students sheet
const wsPG = XLSX.utils.json_to_sheet(pgStudents);
XLSX.utils.book_append_sheet(wb, wsPG, "PG Students");

// Save the file in server/utils folder
const filePath = join(__dirname, 'sample_students.xlsx');
XLSX.writeFile(wb, filePath);

console.log('✅ Sample Excel file created successfully!');
console.log('📁 Location:', filePath);
console.log('\n📋 Contents:');
console.log(`   - Sheet 1 "UG Students": ${ugStudents.length} students`);
console.log(`   - Sheet 2 "PG Students": ${pgStudents.length} students`);
console.log('\n💡 Use either sheet for bulk upload testing');
console.log('   UG students have: batch, section');
console.log('   PG students have: ugCGPA, gateScore, workExperience');
