const { expect } = require('chai');

const Register = require('./helpers/register');
const UserFactory = require('./factories/user');
const TodoFactory = require('./factories/todo');
const truncateDatabase = require('./helpers/truncate');

const app = require('../index');
const request = require('supertest')(app);

let todos = [];
let loggerUserId;
let loggedUserToken = null;

describe('API', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;

        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
    });

    describe('todos', () => {
        describe('POST /todos', () => {
            it('registers a new todo when passing valid data', async () => {
                const todo = await TodoFactory.create();

                let response = await request
                    .post('/todos')
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({ name: todo.name });

                expect(response.body)
                    .to.have.property('creatorId')
                    .to.equal(loggerUserId);
            });

            it('returns an error if name is blank', async () => {
                let response = await request
                    .post('/todos')
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({ name: null });

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'name',
                    message: 'cannot be blank'
                });
            });
        });

        describe('GET /todos/{id}', () => {
            it('fetches a single todo', async () => {
                let response = await request
                    .get(`/todos/${todos[0].id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.body).to.have.property('name');
                expect(response.body.name).to.equal(todos[0].name);
            });

            it("returns 404 if todo hasn't been found", async () => {
                let response = await request
                    .get(`/todos/not-found`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PATCH /todos/{id}', () => {
            it('updates a todo', async () => {
                const updatedName = 'updated';
                const todo = await TodoFactory.create({
                    userId: loggerUserId
                });

                await request
                    .patch(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({ name: updatedName });

                let response = await request
                    .get(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.body.name).to.equal(updatedName);
            });

            it("returns 403 when trying to update someone else's todo", async () => {
                const updatedName = 'updated';

                const anotherUser = await UserFactory.create();
                const todo = await TodoFactory.create({
                    userId: anotherUser.id
                });

                let response = await request
                    .patch(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({ name: updatedName });

                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if todo hasn't been found", async () => {
                const updatedName = 'updated';

                let response = await request
                    .patch(`/todos/9999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({ name: updatedName });

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PUT /todos/{id}', () => {
            it('saves a todo when not found', async () => {
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

                expect(response.body).to.have.property('name');
                expect(response.body.name).to.equal(todo.name);
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

        describe('DELETE /todos/{id}', () => {
            it('deletes a todo', async () => {
                const todo = await TodoFactory.create({
                    userId: loggerUserId
                });

                let response = await request
                    .delete(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(204);
            });

            it("returns 403 when trying to delete someone else's todo", async () => {
                const anotherUser = await UserFactory.create();
                const todo = await TodoFactory.create({
                    userId: anotherUser.id
                });

                let response = await request
                    .delete(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(403);
            });

            it("returns 204 if todo hasn't been found", async () => {
                let response = await request
                    .delete(`/todos/99999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(204);
            });
        });
    });
});
