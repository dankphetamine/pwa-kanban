import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Database } from '../models/context';
import { Post } from './../models/post';

@Resolver(Post)
export class PostResolver {
	//#region CREATE
	@Mutation(() => Post)
	createPost(@Arg('title') title: string, @Arg('content') content: string, @Ctx() { prisma: { post } }: Database) {
		return post.create({
			data: {
				title,
				content,
				userId: 3,
			},
		});
	}
	//#endregion

	//#region READ
	@Query(() => [Post], { nullable: true })
	getPosts(@Ctx() { prisma: { post } }: Database) {
		return post.findMany();
	}

	@Query(() => Post, { nullable: true })
	getPost(@Arg('id') id: number, @Ctx() { prisma: { post } }: Database) {
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
