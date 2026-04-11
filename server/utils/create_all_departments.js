import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

const departments = [
  { id: 'CSE', name: 'Computer Science and Engineering' },
  { id: 'ECE', name: 'Electronics and Communication Engineering' },
  { id: 'EEE', name: 'Electrical and Electronics Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering' },
  { id: 'CHEM', name: 'Chemical Engineering' },
  { id: 'MME', name: 'Metallurgical and Materials Engineering' },
  { id: 'ICE', name: 'Instrumentation and Control Engineering' },
  { id: 'PROD', name: 'Production Engineering' },
  { id: 'ARCH', name: 'Architecture' },
];

console.log('Creating departments...\n');

for (const dept of departments) {
  try {
    const existing = await client.department.findUnique({
      where: { id: dept.id }
    });
    
    if (existing) {
      console.log(`⚠️  ${dept.id} - Already exists`);
    } else {
      await client.department.create({
        data: dept
      });
      console.log(`✅ ${dept.id} - ${dept.name}`);
    }
  } catch (error) {
    console.log(`❌ ${dept.id} - Error: ${error.message}`);
  }
}

console.log('\n✅ Department setup complete!');
await client.$disconnect();
