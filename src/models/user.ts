import { IsEmail, MinLength } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Lengths } from '../utils/constants';
import { Comment } from './comment';
import { Project } from './project';
import { Task } from './task';

@InputType()
export class AuthInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@MinLength(Lengths.password)
	password: string;
}

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
