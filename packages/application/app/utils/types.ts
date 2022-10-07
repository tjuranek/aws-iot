import { Prisma } from '@prisma/client';

type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

export type PrismaCollectionType<T extends (...args: any) => Promise<any>> = GetElementType<Prisma.PromiseReturnType<T>>;
