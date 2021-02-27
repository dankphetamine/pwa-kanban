import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Database } from '../models/context';
import { User } from '../models/user';

@Resolver(User)
export class UserResolver {
	//#region CREATE

	//#endregion

	//#region READ
	@Query(() => User, { nullable: true })
	getUser(@Arg('id') id: number, @Ctx() { prisma: { user } }: Database) {
		return user.findUnique({ where: { id } });
	}

	@Query(() => [User], { nullable: true })
	getusers(@Ctx() { prisma: { user } }: Database) {
		return user.findMany({ include: { posts: true } });
	}
	//#endregion

	//#region UPDATE
	@Mutation(() => User, { nullable: true })
	updateDisplayName(@Arg('email') email: string, @Arg('name') name: string, @Ctx() { prisma: { user } }: Database) {
		return user.update({
			where: { email },
			data: {
				name: { set: name },
			},
		});
	}
	//#endregion

	//#region DELETE
	// ...
	//#region
}
