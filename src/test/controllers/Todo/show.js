const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');

const Register = require('../../helpers/register');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../../index');
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
        it('returns OK when TODO exists as USER', async () => {
            const { body, statusCode } = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body).to.have.property('name');
            expect(body.name).to.equal(todos[0].name);
            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns NOT_FOUND if belongs to another user as USER', async () => {
            const { token } = await Register(request);

            const { statusCode } = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + token);

            expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
        });

        it("returns NOT_FOUND if todo doesn't exist as USER", async () => {
            const { statusCode } = await request
                .get(`/todos/${uuidv4()}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
        });

        it('returns NOT_FOUND if todo.id is not valid as USER', async () => {
            const { body, statusCode } = await request
                .get('/todos/Wrong_ID_not_UUID')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                message: 'Must be a valid UUID.',
                param: 'id'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
