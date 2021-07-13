const { expect } = require('chai');

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
        it('fetches a single todo', async () => {
            let response = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body).to.have.property('name');
            expect(response.body.name).to.equal(todos[0].name);
        });

        it('returns 404 if belongs to another user', async () => {
            const { user, token } = await Register(request);

            let response = await request
                .get(`/todos/${todos[0].id}`)
                .set('Authorization', 'Bearer ' + token);

            expect(response.statusCode).to.equal(404);
        });

        it("returns 404 if todo hasn't been found", async () => {
            let response = await request
                .get(`/todos/not-found`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(404);
        });
    });
});
