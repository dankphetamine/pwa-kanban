import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './user';

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
