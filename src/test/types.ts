import { gql } from 'apollo-server-express';

export default gql`
	type User {
		id: ID!
		name: String
	}

	type Query {
		findUser(id: ID!): User
	}

	type Mutation {
		deleteUser(id: ID!): Boolean
	}
`;
