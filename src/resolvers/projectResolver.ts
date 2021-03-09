import { AuthenticationError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { Task } from '../models/task';
import { Text } from '../utils/constants';
import { Project } from './../models/project';
import { TaskFilterInput } from './../models/task';

@Resolver(Project)
export class ProjectResolver {
	//#region CREATE

	/**
	 * Sends a createProject `mutation` to the API, attempting to create a new project. Throws `AuthenticationError` on failure, on success returns a task
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds the request and database tables
	 * @param name the name of the project
	 * @param description the **optional** description of the project
	 * @returns project or throws an `AuthenticationError`
	 */
	@Mutation(() => Task, { nullable: true })
	async createProject(
		@Ctx() { prisma: { project }, req }: Context,
		@Arg('name') name: string,
		@Arg('description') description?: string,
	) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		return project.create({
			data: {
				name,
				description,
				ownerId: req.session.userId,
			},
			include: { owner: true },
		});
	}
	//#endregion

	//#region READ
	/**
	 * Attempts to find a project by id
	 * @param id the id used to identify the project
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds projects
	 * @returns project or null
	 */
	@Query(() => Task, { nullable: true })
	project(@Arg('id') id: number, @Ctx() { prisma: { project } }: Context) {
		return project.findUnique({ where: { id } });
	}

	/**
	 * Attempts to find multiple projects
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds projects
	 * @returns an array of projects or null
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
