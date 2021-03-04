import { AuthenticationError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { Post, PostFilterInput } from '../models/post';
import { Text } from '../utils/constants';

@Resolver(Post)
export class PostResolver {
	//#region CREATE
	@Mutation(() => Post)
	createPost(@Arg('title') title: string, @Arg('content') content: string, @Ctx() { prisma: { post }, req }: Context) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		return post.create({
			data: {
				title,
				content,
				userId: 3,
			},
			include: { author: true },
		});
	}
	//#endregion

	//#region READ
	@Query(() => [Post], { nullable: true })
	getPosts(@Arg('filter', { nullable: true }) filter: PostFilterInput, @Ctx() { prisma: { post } }: Context) {
		return post.findMany({
			take: filter.limit,
			skip: filter.offset,
			where: { userId: filter.userId },
			orderBy: { updatedAt: 'desc' },
		});
	}

	@Query(() => Post, { nullable: true })
	getPost(@Arg('id') id: number, @Ctx() { prisma: { post } }: Context) {
		return post.findUnique({ where: { id } });
	}
	//#endregion

	//#region UPDATE
	//#endregion

	//#region DELETE
	// @Mutation(() => Post, { nullable: true })
	// deletePost;
	//#endregion
}
