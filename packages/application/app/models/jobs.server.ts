import { prisma } from "~/db.server";

export async function getJobs() {
    return await prisma.job.findMany({
        select: {
            id: true,
            name: true,
        }
    });
}

export async function getJobDetails(id: number) {
    return await prisma.job.findFirst({
        where: { id },
        include: {
            employee: true,
            machine: true
        }
    });
}