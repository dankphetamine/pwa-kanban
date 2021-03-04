import { IsInt, IsOptional } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { User } from './user';

@InputType()
export class PostFilterInput {
	@Field(() => Int, { nullable: true })
	@IsInt()
	@IsOptional()
	limit: number;

	@Field(() => Int, { nullable: true })
	@IsInt()
	@IsOptional()
	offset: number;

	@Field(() => Int, { nullable: true })
	@IsInt()
	@IsOptional()
	userId: number;
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
