import { PrismaClient } from '@prisma/client';
import argon2id from 'argon2';

const prisma = new PrismaClient();
const pass = process.env.PASSWORD!;

async function main() {
	/**
	 * Order is important, since there is connected a relation which requires previous entries made, to create relation/connect
	 * Order as follows: Users -> Projects -> Tasks (hiearchy)
	 */
	await addUsers();

	await addProjects();

	await addTasks();
}

main()
	.catch(e => {
		console.error(e);
		process.exit();
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

async function addUsers() {
	await prisma.user.upsert({
		where: { email: 'smsj@easv.dk' },
		update: {
			email: 'smsj@easv.dk',
			name: 'Søren',
			image: 'https://www.easv.dk/app/uploads/2017/09/SMSJ_06_150x150_acf_cropped_quality-85.jpg',
		},
		create: {
			email: `smsj@easv.dk`,
			password: await argon2id.hash([pass].reverse().join()),
			name: 'Søren',
			image: 'https://www.easv.dk/app/uploads/2017/09/SMSJ_06_150x150_acf_cropped_quality-85.jpg',
		},
	});
	await prisma.user.upsert({
		where: { email: 'kw@easv.dk' },
		update: {
			email: 'kw@easv.dk',
			name: 'Kristian',
			image: 'https://www.easv.dk/app/uploads/2017/09/KW_03_150x150_acf_cropped_quality-85.jpg',
		},
		create: {
			email: `kw@easv.dk`,
			password: await argon2id.hash([pass].reverse().join()),
			name: 'Kristian',
			image: 'https://www.easv.dk/app/uploads/2017/09/KW_03_150x150_acf_cropped_quality-85.jpg',
		},
	});

	await prisma.user.upsert({
		where: { email: 'asge0907@easv365.dk' },
		update: {
			email: 'asge0907@easv365.dk',
			name: 'Asger Storm',
			image:
				'https://cdn.shopify.com/s/files/1/0160/2840/1712/products/cheems_characterai_ry-min_739x.png?v=1606473176',
		},
		create: {
			email: 'asge0907@easv365.dk',
			password: await argon2id.hash(pass),
			name: 'Asger Storm',
			image:
				'https://cdn.shopify.com/s/files/1/0160/2840/1712/products/cheems_characterai_ry-min_739x.png?v=1606473176',
		},
	});
}

async function addProjects() {
	await prisma.project.upsert({
		where: { id: 1 },
		update: {
			name: 'Project 1',
			description: 'Description 1',
			owner: { connect: { id: 1 } },
		},
		create: {
			name: 'Project 1',
			description: 'Description 1',
			owner: { connect: { id: 1 } },
		},
	});

	await prisma.project.upsert({
		where: { id: 2 },
		update: {
			name: 'Project 2',
			description: 'Description 2',
			owner: { connect: { id: 2 } },
		},
		create: {
			name: 'Project 2',
			description: 'Description 2',
			owner: { connect: { id: 2 } },
		},
	});

	await prisma.project.upsert({
		where: { id: 3 },
		update: {
			name: 'Project 3',
			owner: { connect: { id: 3 } },
		},
		create: {
			name: 'Project 3',
			owner: { connect: { id: 3 } },
		},
	});
}

async function addTasks() {
	await prisma.task.upsert({
		where: { id: 1 },
		update: {
			title: 'Task 1',
			description: 'Description 1',
			project: { connect: { id: 1 } },
		},
		create: {
			title: 'Task 1',
			description: 'Description 1',
			project: { connect: { id: 1 } },
		},
	});

	await prisma.task.upsert({
		where: { id: 2 },
		update: {
			title: 'Task 2',
			description: 'Description 2',
			project: { connect: { id: 2 } },
		},
		create: {
			title: 'Task 2',
			description: 'Description 2',
			project: { connect: { id: 2 } },
		},
	});

	await prisma.task.upsert({
		where: { id: 3 },
		update: {
			title: 'Task 3',
			description: 'Description 3',
			project: { connect: { id: 3 } },
		},
		create: {
			title: 'Task 3',
			description: 'Description 3',
			project: { connect: { id: 3 } },
		},
	});

	await prisma.task.upsert({
		where: { id: 4 },
		update: {
			title: 'Task 4',
			description: 'Description 4',
			project: { connect: { id: 3 } },
		},
		create: {
			title: 'Task 4',
			status: 'inProgress',
			description: 'Description 4',
			project: { connect: { id: 3 } },
		},
	});
}
