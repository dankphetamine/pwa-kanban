export const PROD = process.env.NODE_ENV === 'production';

export const Text = {
	auth: {
		field: (name: string) => name,
		register: {
			email_taken: 'That email is already registered',
			error: 'Unable to register',
		},
		login: 'Invalid login credentials.',
	},
};

export enum Lengths {
	password = 5,
}

export const sessionSecret = '12345';
