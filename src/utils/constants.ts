// Boolean representation for whether the environment is in production or not (development, testing, etc.)
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
		no_task: 'Task not found',
	},
	project: {
		no_project: 'Project not found',
		no_access: 'You do not have access to this project',
		no_permissions: 'You do not have permissions',
	},
};

// All lenghts stored as enums to ensure very strict input
export enum Numbers {
	password = 5,
	queryLimit = 10,
	queryMaxLimit = 25,
}

// Task Status
export enum Status {
	BACKLOG = 'backlog',
	TODO = 'toDo',
	IN_PROGRESS = 'inProgress',
	DONE = 'done',
}

export const startMsg = `Backend running & listening on http://0.0.0.0:${process.env.PORT_BACKEND}/graphql`;
export const frontEnd = `http://localhost:${process.env.PORT_FRONTEND}`;
