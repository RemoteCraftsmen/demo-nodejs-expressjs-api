const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let todos = [];
let loggerUserId;
let loggedUserToken;

describe('Todos', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;

        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
    });

    describe('GET /todos/{id}', () => {
        it('Returns OK and fetches a single todo sending valid data', async () => {
            let response = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body).to.have.property('name');
            expect(response.body.name).to.equal(todos[0].name);

            expect(response.statusCode).to.equal(StatusCodes.OK);
        });

        it('Returns NOT_FOUND if belongs to another user', async () => {
            const { token } = await Register(request);

            let response = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + token);

            expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
        });

        it("Returns NOT_FOUND if todo doesn't exist", async () => {
            let response = await request
                .get(`/todos/not-found`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
        });
    });
});
