import { IsEmail, IsInt, IsOptional, IsString, Max, MinLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Numbers } from '../utils/constants';

@InputType()
export class FilterInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Max(Numbers.queryMaxLimit)
	limit: number = Numbers.queryLimit;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	offset: number;
}

@InputType()
export class TaskFilterInput extends FilterInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	projectId: number;
}

@InputType()
export class AuthInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@MinLength(Numbers.password)
	password: string;
}

@InputType()
export class ProjectUpdateInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	name?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	description?: string;
}
