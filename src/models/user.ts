import { IsEmail, MinLength } from 'class-validator';
import 'reflect-metadata';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Lengths } from '../utils/constants';
import { Post } from './post';

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

	@Field()
	email: string;

	//Not a field, thus not exposed to GraphQL
	password: string;

	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => [Post], { nullable: true })
	posts?: [Post];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
