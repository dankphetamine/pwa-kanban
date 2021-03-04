import { IsInt, IsOptional, Min } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { User } from './user';

@InputType()
export class PostFilterInput {
	@Field()
	@IsOptional()
	@IsInt()
	userId: number;

	@Field()
	@IsOptional()
	@IsInt()
	@Min(1)
	limit: number;

	@Field()
	@IsOptional()
	@IsInt()
	offest: number;
}

@ObjectType()
export class Post {
	@Field(_type => ID)
	id: number;

	@Field()
	title: string;

	@Field()
	content: string;

	@Field()
	published: boolean;

	@Field(() => User)
	author: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
