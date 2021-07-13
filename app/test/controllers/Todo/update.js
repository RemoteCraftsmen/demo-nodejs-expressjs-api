const { expect } = require('chai');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
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

    describe('PUT /todos/{id}', () => {
        it('Returns 404 when not found', async () => {
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

            expect(response.statusCode).to.equal(404);
        });

        it('puts a todo when found', async () => {
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
        });

        it('returns an error if name is blank', async () => {
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
        });

        it("returns 403 when trying to put to someone else's todo", async () => {
            const updatedName = 'updated';
            const anotherUser = await UserFactory.create();
            const todo = await TodoFactory.create({
                userId: anotherUser.id
            });

            let response = await request
                .put(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: updatedName });

            expect(response.statusCode).to.equal(403);
        });
    });
});
