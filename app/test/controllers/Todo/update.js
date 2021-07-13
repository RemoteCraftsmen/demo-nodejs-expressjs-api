const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const { v4: uuidv4 } = require('uuid');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let loggerUserId;
let loggedUserToken;

describe('Todos', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;
    });

    describe('PUT /todos/{id}', () => {
        it('returns OK sending valid data as USER', async () => {
            const todo = await TodoFactory.create({
                userId: loggerUserId
            });
            const anotherTodo = await TodoFactory.build({
                userId: loggerUserId
            });

            await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: anotherTodo.name });

            const { body, statusCode } = await request
                .get(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body).to.have.property('name');
            expect(body.name).to.equal(anotherTodo.name);
            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns BAD_REQUEST if name is blank as USER', async () => {
            const todo = await TodoFactory.create({
                userId: loggerUserId
            });
            const anotherTodo = await TodoFactory.build({ name: null });

            const { body, statusCode } = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: anotherTodo.name });

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                param: 'name',
                message: 'cannot be blank'
            });
            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it("returns FORBIDDEN when trying to put to someone else's todo as USER", async () => {
            const updatedName = 'updated';
            const anotherUser = await UserFactory.create();
            const todo = await TodoFactory.create({
                userId: anotherUser.id
            });

            const { statusCode } = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: updatedName });

            expect(statusCode).to.equal(StatusCodes.FORBIDDEN);
        });

        it('returns NOT_FOUND when todo does not exist as USER', async () => {
            const todo = await TodoFactory.build({
                id: uuidv4(),
                userId: loggerUserId
            });

            const { statusCode } = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({
                    id: todo.id,
                    name: todo.name,
                    userId: todo.userId,
                    creatorId: todo.userId
                });

            expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
        });
    });
});
