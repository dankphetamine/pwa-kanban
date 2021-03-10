import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers';
import typeDefs from './types';

export const server = new ApolloServer({
	typeDefs,
	resolvers,
	// mockEntireSchema: true,
});
