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
git clone git@bitbucket.org:remotecraftsmen/nodejs-express-api.git
cd ./nodejs-express-api

#install dependencies
npm install

#docker setup
docker-compose up --build #or install postgres manually

# copy file and set proper data inside
cp .env.example .env

#database setup
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all

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
docker-compose -f docker-compose.prod.yml up --build -d # or install mysql and redis manually

# run process manager
pm2 start pm2.json --env=production
```

## Development

```
npm run dev
```

## Run tests

```
# copy file and set proper data inside
cp .env.example .env.test

docker-compose --env-file .env.test -f docker-compose.test.yml up -d

npm run test
```

## Usage

### Register the user

`POST auth/register`

**Params:** `username`, `firstName`, `lastName`, `email`, `password` **Response:** You'll receive a JSON response containing a token.

**Notes:**

When making future requests include the token in one of these places:

-   access_token -> in the request body.
-   access_token -> in the request params.
-   header -> Authorization: Bearer <token>.

### Logging in

`POST /auth/login`

**Params:** `email`, `password` **Response:** You'll receive a JSON response containing a token and user data.

### DEMO

Live demo available at http://node-express-demo.rmtcfm.com

# Documentation

There are two ways to use API documentation

## Api doc

```
npm run apidoc
```

## Swagger doc

```
npm run swagger2json
npm run swagger2html
```
