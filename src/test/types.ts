import { gql } from 'apollo-server-express';

export default gql`
	type User {
		id: ID!
		name: String
	}

	type Query {
		findUser(id: ID!): User
		findUsers: [User]
	}

	type Mutation {
		deleteUser(id: ID!): Boolean
		createUser(name: String!): Boolean
		updateUser(id: ID!, name: String!): Boolean
	}
`;
