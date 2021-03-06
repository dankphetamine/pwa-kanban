import { AuthenticationError } from 'apollo-server-express';
import argon2id from 'argon2';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { User } from '../models/user';
import { Text } from '../utils/constants';
import { Context } from './../models/context';
import { AuthInput } from './../models/user';
import { cookieName } from './../utils/constants';

@Resolver(User)
export class UserResolver {
	//Disables users from seeing other users emails. Can still see their own.
	@FieldResolver()
	email(@Ctx() { req }: Context, @Root() user: User) {
		return req.session.userId === user.id ? user.email : '';
	}

	//#region CREATE
	@Mutation(() => User)
	async register(
		@Arg('input') input: AuthInput,
		@Ctx()
		{ prisma: { user } }: Context,
	) {
		const dbUser = await user.findUnique({ where: { email: input.email } });

		if (dbUser) throw new AuthenticationError(Text.auth.register.email_taken);

		const dbResponse = await user.create({
			data: {
				email: input.email,
				password: await argon2id.hash(input.password),
			},
		});

		if (!dbResponse) throw new AuthenticationError(Text.auth.register.error);

		return dbResponse;
	}
	//#endregion

	//#region READ
	@Mutation(() => User)
	async login(
		@Arg('input') input: AuthInput,
		@Ctx()
		{ prisma: { user }, req }: Context,
	) {
		const dbUser = await user.findUnique({
			where: { email: input.email },
		});

		if (!dbUser) throw new AuthenticationError(Text.auth.login);

		const passMatch = await argon2id.verify(dbUser.password, input.password);

		if (!passMatch) throw new AuthenticationError(Text.auth.login);

		req.session.userId = dbUser.id;

		return dbUser;
	}

	@Query(() => User, { nullable: true })
	user(@Arg('email') email: string, @Ctx() { prisma: { user } }: Context) {
		return user.findUnique({ where: { email } });
	}

	@Query(() => [User], { nullable: true })
	users(@Ctx() { prisma: { user } }: Context) {
		return user.findMany({ include: { posts: true } });
	}

	@Query(() => User, { nullable: true })
	currentUser(@Ctx() { prisma: { user }, req }: Context) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		return user.findUnique({ where: { id: req.session.userId } });
	}
	//#endregion

	//#region UPDATE
	@Mutation(() => User, { nullable: true })
	updateName(@Arg('email') email: string, @Arg('name') name: string, @Ctx() { prisma: { user } }: Context) {
		return user.update({
			where: { email },
			data: {
				name: { set: name },
			},
		});
	}
	//#endregion

	//#region DELETE
	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: Context) {
		res.clearCookie(cookieName);
		return new Promise((resolve, _reject) =>
			// req.session.destroy(err => {
			// 	return err ? reject('No session') : resolve(true);
			// }),
			req.session.destroy(err => {
				if (err) {
					resolve(false);
					return;
				}

				resolve(true);
			}),
		);
	}
	//#endregion
}
