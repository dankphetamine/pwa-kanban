import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Comment } from './comment';
import { Project } from './project';
import { Task } from './task';

@ObjectType()
export class User {
	@Field(_type => ID)
	id: number;

	@Field({ nullable: true })
	email: string;

	//Not a field, thus not exposed to GraphQL
	password: string;

	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => String, { nullable: true })
	image?: string;

	@Field(() => [Task], { nullable: true })
	tasks?: [Task];

	@Field(() => [Comment], { nullable: true })
	comments?: [Comment];

	@Field(() => [Project], { nullable: true })
	projects?: [Project];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
