import { IsEmail } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Post } from './post';

@ObjectType()
export class User {
	@Field(_type => ID)
	id: number;

	@Field()
	@IsEmail()
	email!: string;

	//Not a field, thus not exposed to GraphQL
	password: string;

	@Field(() => String, { nullable: true })
	displayName?: string | null;

	@Field(_type => Post, { nullable: true })
	posts?: [Post] | null;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
