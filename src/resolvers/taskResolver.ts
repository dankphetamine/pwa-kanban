import { AuthenticationError } from 'apollo-server-express';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { TaskFilterInput } from '../models/inputTypes';
import { Task } from '../models/task';
import { Text } from '../utils/constants';

@Resolver(Task)
export class TaskResolver {
	//#region CREATE

	/**
	 * Sends a createTask `mutation` to the API, attempting to create a new task. Throws `AuthenticationError` on failure, on success returns a task
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the request and database tables
	 * @param projectId the id used to identify the task
	 * @param title title of the task
	 * @param description description of the task
	 * @param asigneeId optional asignee (user ID)
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
			},
			include: { project: true, reporter: true, asignee: true },
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
	task(@Ctx() { prisma: { task } }: Context, @Arg('id', () => Int) id: number) {
		return task.findUnique({ where: { id } });
	}

	/**
	 * Attempts to find multiple tasks
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds tasks
	 * @returns an array of tasks or null
	 */
	@Query(() => [Task], { nullable: true })
	tasks(@Ctx() { prisma: { task } }: Context, @Arg('filter', { nullable: true }) filter?: TaskFilterInput) {
		return task.findMany({
			take: filter?.limit,
			skip: filter?.offset,
			where: { projectId: filter?.projectId },
			include: { project: true, asignee: true, reporter: true },
			orderBy: { updatedAt: 'desc' },
		});
	}
	//#endregion

	//#region UPDATE

	//#endregion

	//#region DELETE

	//#endregion
}
