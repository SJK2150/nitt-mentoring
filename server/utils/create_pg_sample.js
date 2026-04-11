import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample PG students only
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
  },
  {
    name: "Suresh Kumar",
    regno: "206123004",
    password: "Welcome123",
    department: "MECH",
    year: "PG",
    ugCGPA: 8.2,
    gateScore: 610,
    workExperience: "No experience"
  },
  {
    name: "Divya Lakshmi",
    regno: "206123005",
    password: "Welcome123",
    department: "CSE",
    year: "PG",
    ugCGPA: 9.3,
    gateScore: 750,
    workExperience: "4 years at Cognizant"
  }
];

// Create workbook
const wb = XLSX.utils.book_new();

// Add PG students sheet
const wsPG = XLSX.utils.json_to_sheet(pgStudents);
XLSX.utils.book_append_sheet(wb, wsPG, "PG Students");

// Save in server/utils folder
const filePath = join(__dirname, 'sample_pg_students.xlsx');
XLSX.writeFile(wb, filePath);

console.log('✅ PG Sample Excel created: sample_pg_students.xlsx');
console.log('📁 Location:', filePath);
console.log('📋 5 PG students with ugCGPA, gateScore, workExperience');
