import { IsInt, IsOptional, Max } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { Numbers, Status } from './../utils/constants';
import { Comment } from './comment';
import { Project } from './project';
import { User } from './user';

@InputType()
export class TaskFilterInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Max(Numbers.queryMaxLimit)
	limit: number = Numbers.queryLimit;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	offset: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	projectId: number;
}

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
