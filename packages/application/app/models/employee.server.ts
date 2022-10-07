import { prisma } from "~/db.server";

export async function createEmployee(name: string, position: string) {
    await prisma.employee.create({ data: { name, position } });
}

export async function getEmployee(id: number) {
    return await prisma.employee.findFirst({ 
        where: { id },
        select: {
            id: true,
            name: true,
        }
    });
}

export async function getEmployeeDetails(id: number) {
    return await prisma.employee.findFirst({
        where: { id }
    });
}

export async function getEmployees() {
    return await prisma.employee.findMany();
}

export async function getEmployeeCount() {
    return (await prisma.employee.findMany()).length;
}