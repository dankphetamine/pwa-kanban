import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import prisma, { Context } from './models/context';
import { PostResolver } from './resolvers/postResolver';
import { UserResolver } from './resolvers/userResolver';
import { PROD, sessionSecret } from './utils/constants';

const main = async () => {
	const apollo = new ApolloServer({
		schema: await buildSchema({ resolvers: [UserResolver, PostResolver], validate: true }),
		context: ({ req, res }): Context => ({ prisma, req, res }),
		debug: !PROD,
	});

	const app = express();

	app.use(
		session({
			cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days expiration
			secret: process.env.PASSWORD ?? sessionSecret,
			saveUninitialized: false,
			resave: false,
			store: new PrismaSessionStore(prisma, {
				checkPeriod: 2 * 60 * 1000,
				dbRecordIdIsSessionId: true,
				dbRecordIdFunction: undefined,
			}),
		}),
	);

	apollo.applyMiddleware({ app });

	app.listen(4321, () => console.log('Backend running & listening on http://localhost:4321/graphql'));
};

main().catch(err => console.error(err));
