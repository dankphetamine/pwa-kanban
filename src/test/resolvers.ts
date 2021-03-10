const users = [...Array(2).keys()].map(key => ({
	id: key.toString(),
	name: `Name${key}`,
}));

export default {
	Query: {
		findUser: (_parent: any, { id }: { id: string }) => {
			const user = users.find(user => user.id === id);
			if (!user) throw new Error('User not found');

			return user;
		},

		findUsers: (_parent: any) => {
			if (!users) throw new Error('Users not found');

			return users;
		},
	},

	Mutation: {
		deleteUser: (_parent: any, { id }: { id: string }) => {
			const index = users.findIndex(user => user.id === id);
			if (index < 0) return false;

			users.splice(index, 1);
			return true;
		},

		updateUser: (_parent: any, { id, name }: { id: string; name: string }) => {
			const user = users.find(user => user.id === id);
			if (!user) throw new Error('User not found');

			user.name = name;
			return user;
		},
	},
};
