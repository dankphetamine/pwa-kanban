const users = [...Array(2).keys()].map(key => ({
	id: key.toString(),
	name: `Name${key}`,
}));

export default {
	Query: {
		findUser: (_parent: any, { id }: { id: string }) => {
			const user = users.find(user => user.id === id);
			if (user) {
				return user;
			} else {
				throw new Error('Not Found!');
			}
		},
	},

	Mutation: {
		deleteUser: (_parent: any, { id }: { id: string }) => {
			const index = users.findIndex(user => user.id === id);
			if (index < 0) return false;
			users.splice(index, 1);
			return true;
		},
	},
};
