import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Status } from './../utils/constants';
import { Comment } from './comment';
import { Project } from './project';
import { User } from './user';

@ObjectType()
export class Task {
	@Field(_type => ID)
	id: number;

	@Field(() => Project)
	project: Project;

	@Field(() => User)
	reporter: User;

	@Field(() => User, { nullable: true })
	asignee?: User;

	@Field()
	title: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => String, { defaultValue: Status.TODO })
	status: string;

	@Field(() => [Comment], { nullable: true })
	comments?: [Comment];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
