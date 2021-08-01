# Node.js Express API

### Prerequisites

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
docker-compose up --build #or install postgres manually)

# copy file and set proper data inside
cp .env.example .env

#database setup
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all
```

## Run for development

### start node server

```
npm run dev
```

## Run for production

### start node server

```
npm run build
npm start
```

## Run tests

```
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
