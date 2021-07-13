const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

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
        it('Returns OK and puts a todo when found', async () => {
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

            let response = await request
                .get(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body).to.have.property('name');
            expect(response.body.name).to.equal(anotherTodo.name);

            expect(response.statusCode).to.equal(StatusCodes.OK);
        });

        it('Returns BAD_REQUEST if name is blank', async () => {
            const todo = await TodoFactory.create({
                userId: loggerUserId
            });
            const anotherTodo = await TodoFactory.build({ name: null });

            let response = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: anotherTodo.name });

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'name',
                message: 'cannot be blank'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it("Returns FORBIDDEN when trying to put to someone else's todo", async () => {
            const updatedName = 'updated';
            const anotherUser = await UserFactory.create();
            const todo = await TodoFactory.create({
                userId: anotherUser.id
            });

            let response = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: updatedName });

            expect(response.statusCode).to.equal(StatusCodes.FORBIDDEN);
        });

        it('Returns NOT_FOUND when todo does not exist', async () => {
            const todo = await TodoFactory.build({
                id: 666,
                userId: loggerUserId
            });

            let response = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({
                    id: todo.id,
                    name: todo.name,
                    userId: todo.userId,
                    creatorId: todo.userId
                });

            expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
        });
    });
});
