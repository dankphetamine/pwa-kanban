import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import createDb from './models/context';
import { PostResolver } from './resolvers/postResolver';
import { UserResolver } from './resolvers/userResolver';

const main = async () => {
	const app = express();

	const apollo = new ApolloServer({
		schema: await buildSchema({ resolvers: [UserResolver, PostResolver], validate: true }),
		context: createDb,
	});

	apollo.applyMiddleware({ app });

	app.listen(4321, () => console.log('Backend running & listening on http://localhost:4321/graphql'));
};

main().catch(err => console.error(err));
