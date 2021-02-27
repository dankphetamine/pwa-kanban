import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'minimal',
});

export interface Database {
	prisma: PrismaClient;
}

function createDb(): Database {
	return { prisma };
}

export default createDb();
