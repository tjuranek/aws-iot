import { prisma } from "~/db.server";

export async function getMachines() {
    return await prisma.machine.findMany({
        select: {
            id: true,
            nickname: true,
            model: true,
            type: {
                select: {
                    name: true
                }
            },
        }
    });
}

export async function getMachineDetails(id: number) {
    return await prisma.machine.findFirst({
        where: { id },
        include: {
            jobs: true,
            type: true
        }
    });
}

export async function getMachineCount() {
    const machines = await prisma.machine.findMany();
    return machines.length;
}