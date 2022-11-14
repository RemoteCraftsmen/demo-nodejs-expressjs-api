# Node.js Express Todo list demo

NodeJS/Express codebase for Todo list

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

For MacOS with file sensitivity, add this option to docker compose mysql: command: --lower_case_table_names=1

-   Node - v14.17.4
-   NPM - v7.20.3
-   Docker - v18.06.1 (optional)

### Installing

From terminal

```
git clone git@github.com:RemoteCraftsmen/demo-nodejs-expressjs-api.git
cd ./demo-nodejs-expressjs-api

# install dependencies
npm install

# copy file and set proper data inside
cp .env.example .env

# docker setup
npm run dc-up

# database setup
npm run db-setup-fresh

# other useful commands
npm run db-drop
npm run db-create
npm run db-migrate
npm run db-seed
npm run db-setup
npm run db-setup-fresh
```

## Run for production

```
# docker setup
npm run dc-up

# run process manager
pm2 start pm2.config.js --env=production
```

## Development

```
npm run dev
```

## Run tests

```
# copy file and set proper data inside (different ports, user names)
cp .env.example .env.test

NODE_ENV=test npm run dc-up
NODE_ENV=test npm run db-setup-fresh 

npm run test
```

## Usage

### Register the user

`POST auth/register`

**Params:** `username`, `firstName`, `lastName`, `email`, `password` **Response:** You'll receive a JSON response containing a token.

**Notes:**

When making future requests include the token in one of these places:

-   header -> Authorization: Bearer <token>.

### Logging in

`POST /auth/login`

**Params:** `email`, `password` **Response:** You'll receive a JSON response containing a token and user data.

### DEMO

Live demo available at https://node-express-demo.rmtcfm.com

# Documentation

There are two ways to use API documentation
https://node-express-demo.rmtcfm.com
https://node-express-demo.rmtcfm.com/swagger

## Api doc

```
npm run apidoc
```

## Swagger doc

```
npm run swagger2json
npm run swagger2html
```
