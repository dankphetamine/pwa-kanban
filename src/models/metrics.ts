import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class TaskProjectMetrics {
	@Field(() => Int)
	tasks: number;

	@Field(() => Int)
	projects: number;

	@Field(() => Int)
	users: number;
}
