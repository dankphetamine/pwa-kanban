import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Status } from './../utils/constants';
import { Project } from './project';

@ObjectType()
export class Task {
	@Field(() => ID)
	id: number;

	@Field(() => Project)
	project: Project;

	@Field()
	title: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => String, { defaultValue: Status.TODO })
	status: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
