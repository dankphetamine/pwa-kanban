import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './user';

@ObjectType()
export class Project {
	@Field(_type => ID)
	id: number;

	@Field(() => User)
	owner: User;

	@Field(() => User)
	reporter: User;

	@Field(() => User, { nullable: true })
	asignee?: User;

	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
