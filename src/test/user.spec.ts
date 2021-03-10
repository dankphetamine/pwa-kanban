import { gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { server } from './client';

const apolloServer = server;

const { query, mutate } = createTestClient(apolloServer);

test('find user', async () => {
	const find_user = gql`
		query {
			findUser(id: "1") {
				id
				name
			}
		}
	`;

	const {
		data: { findUser },
	} = await query({ query: find_user });

	expect(findUser).toEqual({ id: '1', name: 'Name1' });
});

test('throw error if user is not found', async () => {
	const find_user = gql`
		query {
			findUser(id: "10") {
				id
				name
			}
		}
	`;

	const {
		//@ts-expect-error
		errors: [error],
	} = await query({ query: find_user });

	expect(error.message).toEqual('user not found');
});

// test('create user', async () => {
// 	const create_user = gql`
// 		mutation($name: String!) {
// 			createUser(name: $name) {
// 				id
// 				name
// 			}
// 		}
// 	`;

// 	const {
// 		data: { createUser },
// 	} = await mutate({ mutation: create_user, variables: { name: 'created name' } });

// 	expect(createUser).toBeTruthy();
// });

test('delete user', async () => {
	const delete_user = gql`
		mutation($id: ID!) {
			deleteUser(id: $id)
		}
	`;

	const {
		data: { deleteUser },
	} = await mutate({ mutation: delete_user, variables: { id: '1' } });

	expect(deleteUser).toBeTruthy();
});

test('can not delete user twice', async () => {
	const delete_user = gql`
		mutation($id: ID!) {
			deleteUser(id: $id)
		}
	`;

	const {
		data: { deleteUser },
	} = await mutate({ mutation: delete_user, variables: { id: '1' } });

	expect(deleteUser).toBeFalsy();
});

// test('update user', async () => {
// 	const update_user = gql`
// 		mutation($id: ID!, $name: String!) {
// 			updateUser(id: $id, name: $name) {
// 				id
// 				name
// 			}
// 		}
// 	`;

// 	const {
// 		data: { updateUser },
// 	} = await mutate({ mutation: update_user, variables: { id: '1', name: 'updated name' } });

// 	expect(updateUser).toEqual({ id: '1', name: 'updated name' });
// });
