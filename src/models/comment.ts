import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Task } from './task';
import { User } from './user';

@ObjectType()
export class Comment {
	@Field(_type => ID)
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
