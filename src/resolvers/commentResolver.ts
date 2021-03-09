import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { Comment } from '../models/comment';
import { Context } from './../models/context';

@Resolver(Comment)
export class CommentResolver {
	//#region Create
	// @Mutation(() => Comment, {nullable: true}) {
	//     createComment(

	//     )
	// }
	//#endregion

	//#region Read
	@Query(() => Comment, { nullable: true })
	comment(@Ctx() { prisma: { comment } }: Context, @Arg('id') id: number) {
		return comment.findUnique({ where: { id } });
	}

	@Query(() => [Comment], { nullable: true })
	comments(@Ctx() { prisma: { comment } }: Context) {
		return comment.findMany();
	}
	//#endregion
}
