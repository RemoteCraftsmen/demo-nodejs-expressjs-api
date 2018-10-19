import { assert, should, expect } from 'chai';

import Setup from './Setup';
import jwt from 'jsonwebtoken';
import UserFactory from './factories/user';
import TodoFactory from './factories/todo';
import truncateDatabase from './truncate';

let server;
let API;
let todos = [];
let user_id;

describe('API', function() {
    before(async function() {
        server = require('../index');

        truncateDatabase();
        let { client, token } = await Setup.API();

        API = client;

        let decoded = jwt.decode(token);

        user_id = decoded.id;

        todos.push(await TodoFactory({ user_id }));
        todos.push(await TodoFactory({ user_id }));
        todos.push(await TodoFactory({ user_id }));
    });

    describe('todos', function() {
        describe('POST /todos', function() {
            it('registers a new todo when passing valid data', async function() {
                const todo = await TodoFactory({}, true);

                const { data } = await API.post(`/todos`, todo);

                expect(data)
                    .to.have.property('creator_id')
                    .to.equal(user_id);
            });

            it('returns an error if name is blank', async function() {
                let data;

                const todo = await TodoFactory({ name: null }, true);

                try {
                    let { data } = await API.post(`/todos`, todo);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if user_id is blank', async function() {
                let data;

                const todo = await TodoFactory({ user_id: null }, true);

                try {
                    let { data } = await API.post(`/todos`, todo);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'user_id',
                    message: 'cannot be blank'
                });
            });
        });

        describe('GET /todos/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('fetches a single todo', async function() {
                const { data } = await API.get(`/todos/${todos[0].id}`);

                expect(data).to.have.property('name');
                expect(data.name).to.equal(todos[0].name);
            });

            it("returns 404 if todo hasn't been found", async function() {
                let status;

                try {
                    await API.get(`/todos/99999`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });

        describe('PATCH /todos/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('updates a todo', async function() {
                const todo = await TodoFactory({ user_id });

                await API.patch(`/todos/${todo.id}`, { name: 'upd' });

                const { data } = await API.get(`/todos/${todo.id}`);

                assert.equal(data.name, 'upd');
            });

            it("returns 401 when trying to update someone else's todo", async function() {
                let status;

                const anotherUser = await UserFactory();

                const todo = await TodoFactory({ user_id: anotherUser.id });

                try {
                    await API.patch(`/todos/${todo.id}`, { name: 'updated' });
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(401);
            });

            it("returns 404 if todo hasn't been found", async function() {
                let status;

                try {
                    await API.patch(`/todos/99999`, { name: 'updated' });
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });

        describe('PUT /todos/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('saves a todo when not found', async function() {
                const todo = await TodoFactory({ id: 666, user_id }, true);

                await API.put(`/todos/${todo.id}`, todo);

                const { data } = await API.get(`/todos/${todo.id}`);

                expect(data).to.have.property('name');
                expect(data.name).to.equal(todo.name);
            });

            it('puts a todo when found', async function() {
                const todo = await TodoFactory({ user_id });
                const anotherTodo = await TodoFactory({ user_id }, true);

                await API.put(`/todos/${todo.id}`, anotherTodo);

                const { data } = await API.get(`/todos/${todo.id}`);

                expect(data).to.have.property('name');
                expect(data.name).to.equal(anotherTodo.name);
            });

            it('returns an error if name is blank', async function() {
                let data;

                const todo = await TodoFactory({ user_id });
                const anotherTodo = await TodoFactory({ name: null }, true);

                try {
                    let { data } = await API.put(`/todos/${todo.id}`, anotherTodo);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if user_id is blank', async function() {
                let data;

                const todo = await TodoFactory({ user_id });
                const anotherTodo = await TodoFactory({ user_id: null }, true);

                try {
                    let { data } = await API.put(`/todos/${todo.id}`, anotherTodo);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'user_id',
                    message: 'cannot be blank'
                });
            });

            it("returns 401 when trying to put to someone else's todo", async function() {
                let status;

                const anotherUser = await UserFactory();

                const todo = await TodoFactory({ user_id: anotherUser.id });

                try {
                    await API.put(`/todos/${todo.id}`, { name: 'updated' });
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(401);
            });
        });

        describe('DELETE /todos/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('deletes a todo', async function() {
                const todo = await TodoFactory({ user_id });

                const response = await API.delete(`/todos/${todo.id}`);

                expect(response.status).to.equal(204);
            });

            it("returns 401 when trying to delete someone else's todo", async function() {
                let status;

                const anotherUser = await UserFactory();

                const todo = await TodoFactory({ user_id: anotherUser.id });

                try {
                    await API.delete(`/todos/${todo.id}`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(401);
            });

            it("returns 404 if todo hasn't been found", async function() {
                let status;

                try {
                    await API.delete(`/todos/99999`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });
    });
});
