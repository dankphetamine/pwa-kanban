import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import prisma, { Context } from './models/context';
import { CommentResolver } from './resolvers/commentResolver';
import { ProjectResolver } from './resolvers/projectResolver';
import { TaskResolver } from './resolvers/taskResolver';
import { UserResolver } from './resolvers/userResolver';
import { frontEnd, port, prod, sessionSecret, startMsg } from './utils/constants';

const main = async () => {
	const apollo = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, TaskResolver, CommentResolver, ProjectResolver],
			validate: true,
		}),
		context: ({ req, res }): Context => ({ prisma, req, res }),
		debug: !prod,
	});

	const app = express();

	//Enables sessions for
	app.use(
		session({
			cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days expiration
			secret: process.env.PASSWORD ?? sessionSecret,
			saveUninitialized: false,
			resave: false,
			store: new PrismaSessionStore(prisma, {
				checkPeriod: 1000 * 60 * 2, // 2 minutes expiration
				dbRecordIdIsSessionId: true,
				dbRecordIdFunction: undefined,
			}),
		}),
	);

	// Applies middleware to the apollo app and enables cors from the frontend and enables crendentials for authentication.
	apollo.applyMiddleware({ app, cors: { origin: frontEnd, credentials: true } });

	app.listen(port, () => console.log(startMsg));
};

// Runs main function (awful style for production apps but very functional)
main().catch(err => console.error(err));
