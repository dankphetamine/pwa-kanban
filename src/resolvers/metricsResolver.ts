import { Ctx, Query, Resolver } from 'type-graphql';
import { Context } from '../models/context';
import { TaskProjectMetrics as UserTaskProjectMetrics } from '../models/metrics';

@Resolver(UserTaskProjectMetrics)
export class MetricsResolver {
	//#region READ
	/**
	 * Returns the total amount of provided entities from the database
	 * @param Ctx The (deconstructed) context, provided under the `Context` interface which holds tasks
	 * @returns an object containing an `Int` representation of the amount of entites found
	 */
	@Query(() => UserTaskProjectMetrics)
	async metrics(@Ctx() { prisma: { user, task, project } }: Context) {
		const users = await user.count();
		const tasks = await task.count();
		const projects = await project.count();

		return new Promise<UserTaskProjectMetrics>((resolve, _reject) => {
			resolve({ users, tasks, projects });
		});
	}
	//#endregion
}
