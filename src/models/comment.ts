import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';
import { Task } from './task';
import { User } from './user';

@ObjectType()
export class Comment {
	@Field(() => Int)
	id: number;

	@Field(() => Task)
	task: Task;

	@Field(() => User)
	author: User;

	@Field()
	text: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
