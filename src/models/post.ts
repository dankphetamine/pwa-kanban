import { IsOptional } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { User } from './user';

@InputType()
export class PostFilterInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	limit: number = 10;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	offset: number;

	@Field(() => Int, { nullable: true })
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
