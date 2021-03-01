import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

declare module 'express-session' {
	interface Session {
		userId: string | number;
	}
}

const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'minimal',
});

export interface Context {
	prisma: PrismaClient;
	req: Request;
	res: Response;
}

export default prisma;
