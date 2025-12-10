import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      registrationNumber: 'ADMIN001',
      department: 'Administration',
      email: 'admin@example.com',
      password: adminPassword,
      isAdmin: true,
    },
  })

  console.log('Admin user created:', admin.email)

  // Create quiz questions
  const questions = [
    {
      title: 'Fix the For Loop',
      description: 'The following for loop has a syntax error. Fix it.',
      brokenCode: `for (i = 0; i < 5; i++) {
  console.log(i);
}`,
      expectedAnswer: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Function Declaration',
      description: 'This function declaration is missing a keyword. Fix it.',
      brokenCode: `multiply(a, b) {
  return a * b;
}`,
      expectedAnswer: `function multiply(a, b) {
  return a * b;
}`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Array Access',
      description: 'There is an error in how the array is being accessed. Fix it.',
      brokenCode: `const numbers = [1, 2, 3, 4, 5];
console.log(numbers(5));`,
      expectedAnswer: `const numbers = [1, 2, 3, 4, 5];
console.log(numbers[4]);`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Object Property',
      description: 'The object property access is incorrect. Fix it.',
      brokenCode: `const person = { name: "John", age: 30 };
console.log(person[name]);`,
      expectedAnswer: `const person = { name: "John", age: 30 };
console.log(person.name);`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Conditional Statement',
      description: 'This conditional statement has a syntax error. Fix it.',
      brokenCode: `if x > 10 {
  console.log("Greater than 10");
}`,
      expectedAnswer: `if (x > 10) {
  console.log("Greater than 10");
}`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Variable Declaration',
      description: 'The variable declaration is missing a keyword. Fix it.',
      brokenCode: `message = "Hello, World!";
console.log(message);`,
      expectedAnswer: `const message = "Hello, World!";
console.log(message);`,
      timeLimit: 30,
    },
    {
      title: 'Fix the String Concatenation',
      description: 'The string concatenation is incorrect. Fix it.',
      brokenCode: `const firstName = "John";
const lastName = "Doe";
const fullName = firstName + lastName;
console.log(fullName);`,
      expectedAnswer: `const firstName = "John";
const lastName = "Doe";
const fullName = firstName + " " + lastName;
console.log(fullName);`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Method Call',
      description: 'The array method call is incorrect. Fix it.',
      brokenCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
};
console.log(doubled);`,
      expectedAnswer: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled);`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Comparison',
      description: 'The comparison operator is incorrect for this scenario. Fix it.',
      brokenCode: `const value = "5";
if (value == 5) {
  console.log("Equal");
}`,
      expectedAnswer: `const value = "5";
if (value === 5) {
  console.log("Equal");
}`,
      timeLimit: 30,
    },
    {
      title: 'Fix the Return Statement',
      description: 'The return statement is missing from this function. Add it.',
      brokenCode: `function add(a, b) {
  const result = a + b;
}`,
      expectedAnswer: `function add(a, b) {
  const result = a + b;
  return result;
}`,
      timeLimit: 30,
    },
  ]

  for (const question of questions) {
    await prisma.question.create({
      data: question,
    })
  }

  console.log('Created 10 quiz questions')
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })