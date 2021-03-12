import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Comment } from '../models/comment';
import { Context } from '../models/context';
import { Text } from '../utils/constants';

@Resolver(Comment)
export class CommentResolver {
	//#region Create
	@Mutation(() => Comment, { nullable: true })
	async createComment(
		@Ctx() { prisma: { comment, project }, req }: Context,
		@Arg('text') text: string,
		@Arg('taskId') taskId: number,
	) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const proj = await project.findUnique({
			where: { id: req.session.userId },
			select: { collaborators: true, tasks: true },
		});

		if (!proj?.collaborators.map(u => u.id).includes(req.session.userId))
			throw new ForbiddenError(Text.project.no_access);

		if (!proj.tasks.map(t => t.id).includes(taskId)) throw new ForbiddenError(Text.project.no_task);

		return comment.create({
			data: {
				text,
				task: { connect: { id: taskId } },
				author: { connect: { id: req.session.userId } },
			},
			include: { task: { select: { id: true, project: { select: { id: true } } } } },
		});
	}
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
