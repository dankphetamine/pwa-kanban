import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';
import { Task } from './task';
import { User } from './user';

@ObjectType()
export class Project {
	@Field(() => Int)
	id: number;

	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => User)
	owner: User;

	@Field(() => [Task], { nullable: true })
	tasks?: [Task];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
