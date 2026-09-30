// Import from your custom generated folder instead of '@prisma/client'
import { PrismaClient } from '../generated/prisma/client.js'; 

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    accelerateUrl : process.env.DATABASE_URL!
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
