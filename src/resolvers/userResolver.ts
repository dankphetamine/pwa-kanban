import argon2id from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../models/user';
import { Text } from '../utils/constants';
import { Context } from './../models/context';
import { AuthInput } from './../models/user';

@Resolver(User)
export class UserResolver {
	//#region CREATE
	@Mutation(() => User)
	async register(
		@Arg('input') input: AuthInput,
		@Ctx()
		{ prisma: { user } }: Context,
	) {
		const dbUser = await user.findUnique({ where: { email: input.email } });

		if (dbUser) throw new Error(Text.auth.register.email_taken);

		const dbResponse = await user.create({
			data: {
				email: input.email,
				password: await argon2id.hash(input.password),
			},
		});

		if (!dbResponse) throw new Error(Text.auth.register.error);

		return dbResponse;
	}

	@Mutation(() => User)
	async login(
		@Arg('input') input: AuthInput,
		@Ctx()
		{ prisma: { user }, req }: Context,
	) {
		const dbUser = await user.findUnique({
			where: { email: input.email },
		});

		if (!dbUser) throw new Error(Text.auth.login);

		const passMatch = await argon2id.verify(dbUser.password, input.password);

		if (!passMatch) throw new Error(Text.auth.login);

		req.session.userId = dbUser.id.toString();

		return dbUser;
	}
	//#endregion

	//#region READ
	@Query(() => User, { nullable: true })
	getUser(@Arg('email') email: string, @Ctx() { prisma: { user } }: Context) {
		return user.findUnique({ where: { email } });
	}

	@Query(() => [User], { nullable: true })
	getusers(@Ctx() { prisma: { user } }: Context) {
		return user.findMany({ include: { posts: true } });
	}

	@Query(() => User, { nullable: true })
	getSelf(@Ctx() { prisma: { user }, req }: Context) {
		let id: number;

		typeof req.session.userId === 'string' ? (id = parseInt(req.session.userId)) : (id = req.session.userId | 0);

		if (!req.session.userId) throw new Error(Text.auth.getSelf);

		return user.findUnique({ where: { id } });
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

	//#endregion
}
