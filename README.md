## Self hosting

To selfhost you will need the following:

- [nodejs](https://nodejs.org)
- a node package manager like npm or yarn
- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)

**Step 1**

install all the dependencies
```console
		npm install
```

or if you use yarn
```console
		yarn
```

**Step 2**

run the command:
```console
		npx prisma generate
```

or of if you use yarn
```console
		yarn prisma generate
```

This will install the necessary prisma related stuff

**Step 3**

Seed the database (Add data)

```console
		npm run seed
```

or if you use yarn
```console
		yarn seed
```

This will add the initial test-able data to the database, allowing for querying on it.

**Step 4 - Final step**

start the application (It will give a link in the terminal to open a localhost with port 3000 by default)

```console
		npm run dev
```

or if you use yarn

 ```console
		yarn dev
```
