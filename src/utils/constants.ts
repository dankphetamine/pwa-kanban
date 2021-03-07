export const prod = process.env.NODE_ENV === 'production';

export const Text = {
	auth: {
		register: {
			email_taken: 'That email is already registered',
			error: 'Unable to register',
		},
		login: 'Invalid login credentials.',
		notLoggedIn: 'You are not currently logged in',
	},
};

export enum Lengths {
	password = 5,
}

export const sessionSecret = '12345';
export const cookieName = 'connect.sid';
export const port = 4000;
export const startMsg = `Backend running & listening on http://localhost${port}/graphql`;
const frontEndPort = 3000;
export const frontEnd = `http://localhost:${frontEndPort}`;

export enum Status {
	BACKLOG = 'backlog',
	TODO = 'todo',
	IN_PROGRESS = 'in progress',
	DONE = 'done',
}
