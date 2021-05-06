import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { TaskFilterInput } from '../models/inputTypes';
import { Task } from '../models/task';
import { Text } from '../utils/constants';
import { TaskUpdateInput } from './../models/inputTypes';

@Resolver(Task)
export class TaskResolver {
	//#region CREATE

	/**
	 * Sends a createTask `mutation` to the API, attempting to create a new task. Throws `AuthenticationError` on failure, on success returns a task
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the request and database tables
	 * @param projectId the id used to identify the task
	 * @param title title of the task
	 * @param description description of the task
	 * @returns task or throws an `AuthenticationError`
	 */
	@Mutation(() => Task, { nullable: true })
	async createTask(
		@Ctx() { prisma: { task, project }, req }: Context,
		@Arg('projectId', () => Int) projectId: number,
		@Arg('title') title: string,
		@Arg('description') description?: string,
	) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const p = await project.findUnique({ where: { id: projectId }, select: { id: true } });

		if (!p?.id) throw new Error(Text.project.no_project);

		return task.create({
			data: {
				projectId: p.id,
				title,
				description,
				reporterId: req.session.userId,
				asigneeId: req.session.userId,
			},
			include: { project: true },
		});
	}
	//#endregion

	//#region READ
	/**
	 * Attempts to find a task by id
	 * @param id the id used to identify the task
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds tasks
	 * @returns task or null
	 */
	@Query(() => Task, { nullable: true })
	async task(@Ctx() { prisma: { task }, req }: Context, @Arg('id', () => Int) id: number) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const tsk = await task.findUnique({
			where: { id },
			include: { project: { select: { ownerId: true } } },
		});

		if (!tsk) throw new Error(Text.task.no_task);

		if (tsk.project.ownerId !== req.session.userId) throw new ForbiddenError(Text.project.no_permissions);

		return task.findUnique({
			where: { id },
			include: { project: true },
		});
	}

	/**
	 * Attempts to find multiple tasks
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds tasks
	 * @returns an array of tasks or null
	 */
	@Query(() => [Task], { nullable: true })
	tasks(@Ctx() { prisma: { task } }: Context, @Arg('filter') filter: TaskFilterInput) {
		return task.findMany({
			take: filter?.limit,
			skip: filter?.offset,
			where: { projectId: filter?.projectId },
			include: { project: true },
			orderBy: { createdAt: 'asc' },
		});
	}
	//#endregion

	//#region UPDATE
	@Mutation(() => Task, { nullable: true })
	async updateTask(
		@Ctx() { prisma: { task }, req }: Context,
		@Arg('id', () => Int) id: number,
		@Arg('input') input: TaskUpdateInput,
	) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const t = await task.findUnique({
			where: { id },
			include: { project: { select: { ownerId: true } } },
		});

		if (!t) throw new Error(Text.task.no_task);

		if (t.project.ownerId !== req.session.userId) throw new ForbiddenError(Text.project.no_permissions);

		return task.update({
			where: { id },
			data: {
				title: { set: input?.title ?? t?.title },
				description: { set: input?.description ?? t?.description },
				status: { set: input?.status ?? t?.status },
			},
		});
	}
	//#endregion

	//#region DELETE
	@Mutation(() => Task, { nullable: true })
	async deleteTask(@Ctx() { prisma: { task }, req }: Context, @Arg('id', () => Int) id: number) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const tsk = await task.findUnique({
			where: { id },
			include: { project: { select: { id: true, ownerId: true } } },
		});

		if (!tsk) throw new Error(Text.task.no_task);

		if (tsk.project.ownerId !== req.session.userId) throw new ForbiddenError(Text.project.no_permissions);

		return task.delete({ where: { id } });
	}
	//#endregion
}
