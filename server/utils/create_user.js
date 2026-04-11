import { hash } from "bcrypt";
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

const args = process.argv.slice(2)

const body = {
  username: args[0],
  password: args[1],
  level: Number(args[2]),
  department: args[3]
}

const encryptedPass = await hash(body.password, 10);

const user = await client.users.create({
  data: { username: body.username, password: encryptedPass, level: body.level },
});

console.log(`✅ User created: ${user.username} (ID: ${user.id}, Level: ${user.level})`);

// For level 1/2 (Faculty or HOD), create faculty record
if (body.level === 1 || body.level === 2) {
  // Get default department or create one
  let dept = body.department
    ? await client.department.findUnique({ where: { id: body.department } })
    : await client.department.findFirst();

  if (!dept) {
    dept = await client.department.create({
      data: {
        id: 'CSE',
        name: 'Computer Science and Engineering'
      }
    });
    console.log(`✅ Created default department: ${dept.name}`);
  }
  
  await client.faculty.create({
    data: {
      id: user.id,
      name: user.username,
      user_id: user.id,
      department_id: dept.id
    }
  });
  console.log(`✅ Faculty record created for ${user.username} in department ${dept.name}`);
}

console.log("✅ Account setup complete!");
