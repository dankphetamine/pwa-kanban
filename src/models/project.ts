import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Task } from './task';
import { User } from './user';

@ObjectType()
export class Project {
	@Field(_type => ID)
	id: number;

	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => User)
	owner: User;

	@Field(() => [User], { nullable: true })
	collaborators?: [User];

	@Field(() => [Task], { nullable: true })
	tasks?: [Task];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
