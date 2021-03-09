//Boolean representation for whether the environment is in production or not (development, testing, etc.)
export const prod = process.env.NODE_ENV === 'production';

// Global text values for the app throughout
export const Text = {
	auth: {
		register: {
			email_taken: 'That email is already registered',
			error: 'Unable to register',
		},
		login: 'Invalid login credentials.',
		notLoggedIn: 'You are not currently logged in',
	},
	task: {
		no_project: 'Project not found',
	},
};

//All lenghts stored as enums to ensure very strict input
export enum Numbers {
	password = 5,
	queryLimit = 10,
	queryMaxLimit = 25,
}

//Task Status
export enum Status {
	BACKLOG = 'backlog',
	TODO = 'todo',
	IN_PROGRESS = 'in progress',
	DONE = 'done',
}

export const sessionSecret = '12345';
export const cookieName = 'connect.sid';
export const port = 4000;
export const startMsg = `Backend running & listening on http://localhost${port}/graphql`;
const frontEndPort = 3000;
export const frontEnd = `http://localhost:${frontEndPort}`;
