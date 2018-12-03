import { assert, should, expect } from 'chai';

import Setup from './Setup';
import jwt from 'jsonwebtoken';
import UserFactory from './factories/user';
import TodoFactory from './factories/todo';
import truncateDatabase from './truncate';

const app = require('../index');
const request = require('supertest')(app);

let todos = [];
let logged_user_id;
let loggedUserToken = null;

describe('API', function() {
    before(async function() {

        await truncateDatabase();

        let token = await Setup.API(request);
        loggedUserToken = token;

        let decoded = jwt.decode(token);
        logged_user_id = decoded.id; 

        todos.push(await TodoFactory({ user_id: logged_user_id }));
        todos.push(await TodoFactory({ user_id: logged_user_id }));
        todos.push(await TodoFactory({ user_id: logged_user_id }));
    });

    describe('super todos', function(){
        describe('POST /todos', function() {
            it('registers a new todo when passing valid data', async function() {
                const todo = await TodoFactory({}, true);

                let response = await request
                    .post('/todos')
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: todo.name});
                    
                expect(response.body)                            
                    .to.have.property('creator_id')
                    .to.equal(logged_user_id);
            });

            it('returns an error if name is blank', async function() {
                let response = await request
                    .post('/todos')
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: null});

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'name',
                    message: 'cannot be blank'
                });
            });
        });

        describe('GET /todos/{id}', function() {
            it('fetches a single todo', async function() {

                let response = await request 
                    .get(`/todos/${todos[0].id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)

                expect(response.body).to.have.property('name');
                expect(response.body.name).to.equal(todos[0].name);
            });

            it("returns 404 if todo hasn't been found", async function() {

                let response = await request 
                    .get(`/todos/999999999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PATCH /todos/{id}', function() {
            it('updates a todo', async function() {

                const updatedName = 'updated';
                const todo = await TodoFactory({ user_id: logged_user_id });
                
                await request 
                    .patch(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: updatedName});

                let response = await request 
                    .get(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)

                expect(response.body.name).to.equal(updatedName);
            });

            it("returns 403 when trying to update someone else's todo", async function() {

                const updatedName = 'updated';

                const anotherUser = await UserFactory();
                const todo = await TodoFactory({ user_id: anotherUser.id });

                let response = await request 
                    .patch(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: updatedName});

                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if todo hasn't been found", async function() {
                
                const updatedName = 'updated';

                let response = await request 
                    .patch(`/todos/9999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: updatedName});

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PUT /todos/{id}', function() {
            it('saves a todo when not found', async function() {
                const todo = await TodoFactory({ id: 666, user_id: logged_user_id }, true);

                let response = await request 
                    .put(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({
                        id: todo.id,
                        name: todo.name,
                        user_id: todo.user_id,
                        creator_id: todo.user_id
                    });
                
                expect(response.body).to.have.property('name');
                expect(response.body.name).to.equal(todo.name);
            });

            it('puts a todo when found', async function() {
                const todo = await TodoFactory({ user_id: logged_user_id });
                const anotherTodo = await TodoFactory({ user_id: logged_user_id }, true);

                await request 
                    .put(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: anotherTodo.name});

                let response = await request 
                    .get(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.body).to.have.property('name');
                expect(response.body.name).to.equal(anotherTodo.name);
            });

            it('returns an error if name is blank', async function() {

                const todo = await TodoFactory({ user_id: logged_user_id });
                const anotherTodo = await TodoFactory({ name: null }, true);

                let response = await request 
                    .put(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: anotherTodo.name});

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'name',
                    message: 'cannot be blank'
                });
            });

            it("returns 403 when trying to put to someone else's todo", async function() {

                const updatedName = 'updated';
                const anotherUser = await UserFactory();
                const todo = await TodoFactory({ user_id: anotherUser.id });

                let response = await request 
                    .put(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({name: updatedName});

                expect(response.statusCode).to.equal(403);
            });
        });

        describe('DELETE /todos/{id}', function() {
            it('deletes a todo', async function() {
                const todo = await TodoFactory({ user_id: logged_user_id });

                let response = await request 
                    .delete(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);


                expect(response.statusCode).to.equal(204);
            });

            it("returns 403 when trying to delete someone else's todo", async function() {

                const anotherUser = await UserFactory();
                const todo = await TodoFactory({ user_id: anotherUser.id });

                let response = await request 
                    .delete(`/todos/${todo.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if todo hasn't been found", async function() {

                let response = await request 
                    .delete(`/todos/99999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });
    });
});
