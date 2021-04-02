import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { ProjectUpdateInput } from '../models/inputTypes';
import { Project } from '../models/project';
import { Text } from '../utils/constants';
import { ProjectFilterInput } from './../models/inputTypes';

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
	@Mutation(() => Project, { nullable: true })
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
	@Query(() => Project, { nullable: true })
	project(@Ctx() { prisma: { project } }: Context, @Arg('id', () => Int) id: number) {
		return project.findUnique({
			where: { id },
			include: { collaborators: true, tasks: { include: { reporter: true, asignee: true, comments: true } } },
		});
	}

	/**
	 * Attempts to find multiple projects. Allows to search for a specific `Collaborator` or `Owner` id
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds projects and the request
	 * @returns an array of projects or null
	 */
	@Query(() => [Project], { nullable: true })
	projects(@Ctx() { prisma: { project } }: Context, @Arg('filter', { nullable: true }) filter?: ProjectFilterInput) {
		return project.findMany({
			where: {
				OR: [
					{
						collaborators: {
							some: {
								id: filter?.userId,
							},
						},
					},
					{ ownerId: filter?.userId },
				],
			},
			take: filter?.limit,
			skip: filter?.offset,
			include: { owner: true, collaborators: true, tasks: true },
			orderBy: { updatedAt: 'desc' },
		});
	}
	//#endregion

	//#region UPDATE
	@Mutation(() => Project, { nullable: true })
	async updateProjectText(
		@Ctx() { prisma: { project }, req }: Context,
		@Arg('id', () => Int) id: number,
		@Arg('input', { nullable: true }) input?: ProjectUpdateInput,
	) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const proj = await project.findUnique({
			where: { id: id },
			select: { name: true, description: true, ownerId: true },
		});

		if (!proj) throw new Error(Text.project.no_project);

		if (proj.ownerId !== req.session.userId) throw new ForbiddenError(Text.project.no_permissions);

		return project.update({
			where: { id },
			data: {
				name: { set: input?.name ?? proj?.name },
				description: { set: input?.description ?? proj?.description },
			},
		});
	}
	//#endregion

	//#region DELETE
	@Mutation(() => Project, { nullable: true })
	async deleteProject(@Ctx() { prisma: { project }, req }: Context, @Arg('id', () => Int) id: number) {
		if (!req.session.userId) throw new AuthenticationError(Text.auth.notLoggedIn);

		const proj = await project.findUnique({
			where: { id },
			select: { name: true, description: true, ownerId: true, id: true },
		});

		if (!proj) throw new Error(Text.project.no_project);

		if (proj.ownerId !== req.session.userId) throw new ForbiddenError(Text.project.no_permissions);

		return project.delete({ where: { id: proj.id } });
	}
	//#endregion
}
