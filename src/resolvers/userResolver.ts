import { User as DbUser } from '@prisma/client';
import { AuthenticationError } from 'apollo-server-express';
import argon2id from 'argon2';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { AuthInput, FilterInput } from '../models/inputTypes';
import { User } from '../models/user';
import { Text } from '../utils/constants';
import { Context } from './../models/context';
import { cookieName } from './../utils/constants';

@Resolver(User)
export class UserResolver {
	/**
	 * Disables users from seeing other users emails. Can still see their own.
	 *
	 * *Note: The null is because of declaration (as optional) in the model itself.
	 * This is potentially a problem, to adjust simply return an empty string instead*
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the request
	 * @param user the Root of the resolver (declared as @Resolver(User)) will provide context
	 * @returns the wanted email (if the user is the same) or null in case it isnt.
	 */
	@FieldResolver()
	email(@Ctx() { req }: Context, @Root() user: User) {
		return req.session?.userId === user.id ? user.email : null;
	}

	//#region CREATE

	/**
	 * Sends a register `mutation` to the API, attempting to create a new user. Throws `AuthenticationError` on failure, on success returns a user
	 * @param input the `AuthInput` `Argument`, provided as an object (`InputType decorator`), to enable validation
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the database connection
	 * @returns user or throws an `AuthenticationError`
	 */
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

	/**
	 * Sends a login `mutation` to the API, attempting to log the user in, which will,
	 * on success provide a `userId` property on the request, or throw `AuthenticationError`
	 * @param input the `AuthInput` `Argument`, provided as an object (`InputType decorator`), to enable validation
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the database connection, request and response
	 * @returns user or throws an `AuthenticationError`
	 */
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

	/**
	 * Attempts to find a user by email
	 * @param email the email used to identify the user
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds users
	 * @returns user or null
	 */
	@Query(() => User, { nullable: true })
	user(@Arg('email') email: string, @Ctx() { prisma: { user } }: Context) {
		return user.findUnique({ where: { email }, include: { projects: true } });
	}

	/**
	 * Attempts to find multiple users
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds users
	 * @returns an array of users or null
	 */
	@Query(() => [User], { nullable: true })
	users(@Ctx() { prisma: { user } }: Context, @Arg('filter', { nullable: true }) filter?: FilterInput) {
		return user.findMany({
			include: { projects: true },
			take: filter?.limit,
			skip: filter?.offset,
			orderBy: { updatedAt: 'desc' },
		});
	}

	/**
	 * Attempts to find a user by id (from the `Session`)
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds users
	 * @returns user or throws an `AuthenticationError`
	 */
	@Query(() => User, { nullable: true })
	currentUser(@Ctx() { prisma: { user }, req }: Context) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		return user.findUnique({ where: { id: req.session.userId }, include: { projects: true } });
	}
	//#endregion

	//#region UPDATE

	/**
	 * Attempts to update the users name
	 * @param email the email used to identify the user
	 * @param name the new name for the user
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds users
	 * @returns user or throws an error
	 */
	@Mutation(() => User, { nullable: true })
	async updateUserName(
		@Arg('email') email: string,
		@Arg('name') name: string,
		@Ctx() { prisma: { user } }: Context,
	): Promise<DbUser> {
		return new Promise(async (resolve, reject) =>
			user
				.update({
					where: { email },
					data: {
						name: { set: name },
					},
				})
				.then(user => resolve(user))
				.catch(_err => reject('Unable to update user name')),
		);
	}
	//#endregion

	//#region DELETE

	/**
	 * Clears the cookie of the `Request`, and destroys the `Session`, resulting in a boolean representation
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the `Request` and `Response`
	 * @returns boolean | true if succeeded, false if failed
	 */
	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: Context): Promise<boolean> {
		res.clearCookie(cookieName);
		return new Promise((resolve, _reject) =>
			req.session.destroy(err => {
				if (err) {
					return resolve(false);
				}

				return resolve(true);
			}),
		);
	}
	//#endregion
}
