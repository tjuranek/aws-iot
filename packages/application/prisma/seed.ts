import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.employee.createMany({ 
    data: [
      {
        name: 'Thomas',
        position: 'Software Developer'
      },
      {
        name: 'Elle',
        position: 'Marketer'
      },
      {
        name: 'Ava',
        position: 'Sales'
      }
    ],
  });

  await prisma.machineType.createMany({
    data: [
      {
        name: 'Printer'
      },
      {
        name: 'Binder'
      },
      {
        name: 'Coverer'
      }
    ]
  });

  await prisma.machine.createMany({
    data: [
      {
        nickname: "Printer 1",
        model: "Company A",
        machineTypeId: 1
      },
      {
        nickname: "Printer 2",
        model: "Company B",
        machineTypeId: 1
      },
      {
        nickname: "Binder 1",
        model: "Company A",
        machineTypeId: 2
      },
      {
        nickname: "Binder 2",
        model: "Company B",
        machineTypeId: 2
      },
      {
        nickname: "Coverer 1",
        model: "Company A",
        machineTypeId: 3
      },
      {
        nickname: "Coverer 2",
        model: "Company B",
        machineTypeId: 3
      },
    ]
  });

  await prisma.job.createMany({
    data: [
      {
        name: "LOTR: Print",
        employeeId: 1,
        machineId: 1,
      },
      {
        name: "LOTR: Bind",
        employeeId: 2,
        machineId: 4,
      },
      {
        name: "LOTR: Cover",
        employeeId: 1,
        machineId: 6,
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });