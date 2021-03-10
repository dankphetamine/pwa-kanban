const users = [...Array(2).keys()].map(key => ({
	id: key.toString(),
	name: `Name${key}`,
}));

export default {
	Query: {
		findUser: (_parent: any, { id }: { id: string }) => {
			const user = users.find(user => user.id === id);
			if (!user) throw new Error('user not found');

			return user;
		},

		findUsers: (_parent: any) => {
			if (!users) throw new Error('users not found');

			return users;
		},
	},

	Mutation: {
		createUser: (_parent: any, { name }: { name: string }) => {
			if (!name) throw new Error('no name included');
			users.push({ id: (users.length ? users.length : 1).toString(), name });
			return users.slice(-1)[0]; //last index, without modifying unlike pop.
		},

		deleteUser: (_parent: any, { id }: { id: string }) => {
			const index = users.findIndex(user => user.id === id);
			if (index < 0) return false;

			users.splice(index, 1);
			return true;
		},

		updateUser: (_parent: any, { id, name }: { id: string; name: string }) => {
			const user = users.find(user => user.id === id);
			if (!user) throw new Error('user not found');

			user.name = name;
			return user;
		},
	},
};
