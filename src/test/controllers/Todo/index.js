const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../../index');
const request = require('supertest')(app);

let todos = [];
let todosAnotherUser = [];
let loggerUserId;
let loggedUserToken;

describe('Todos', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;

        const { user: anotherUser } = await Register(request);

        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todosAnotherUser.push(
            await TodoFactory.create({ userId: anotherUser.id })
        );
    });

    describe('GET /todos', () => {
        it('returns OK with all todos that belongs to user as USER', async () => {
            const {
                body: { rows, count },
                statusCode
            } = await request
                .get('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            for (const todo of todos) {
                expect(rows).to.deep.include({
                    id: todo.id,
                    userId: todo.userId,
                    createdBy: todo.createdBy,
                    name: todo.name,
                    completed: todo.completed,
                    createdAt: todo.createdAt.toISOString(),
                    updatedAt: todo.updatedAt.toISOString()
                });
            }

            for (const todo of todosAnotherUser) {
                expect(rows).to.not.deep.include({
                    id: todo.id,
                    userId: todo.userId,
                    createdBy: todo.createdBy,
                    name: todo.name,
                    completed: todo.completed,
                    createdAt: todo.createdAt.toISOString(),
                    updatedAt: todo.updatedAt.toISOString()
                });
            }

            expect(count).to.deep.equal(todos.length);

            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns UNAUTHORIZED as NOT-LOGGED-IN', async () => {
            const { statusCode } = await request.get('/todos');

            expect(statusCode).to.equal(StatusCodes.UNAUTHORIZED);
        });
    });
});
