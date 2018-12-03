import { assert, should, expect } from 'chai';

import Setup from './Setup';
import jwt from 'jsonwebtoken';
import UserFactory from './factories/user';
import truncateDatabase from './truncate';

const app = require('../index');
const request = require('supertest')(app);

let users = [];

let loggedUserId;
let loggedUserToken = null;

describe('API', function() {
    before(async function() {
        await truncateDatabase();

        loggedUserToken = await Setup.API(request);

        let decoded = jwt.decode(loggedUserToken);
        loggedUserId = decoded.id; 

        users.push(await UserFactory());
        users.push(await UserFactory());
        users.push(await UserFactory());
    });

    describe('users', function() {
        describe('POST /users', function() {
            it('registers a new user when passing valid data', async function() {
                const user = await UserFactory({}, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(true);
            });

            it('returns an error if first_name is blank', async function() {
                const user = await UserFactory({ first_name: null }, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'first_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if last_name is blank', async function() {
                const user = await UserFactory({ last_name: null }, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'last_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if username is blank', async function() {

                const user = await UserFactory({ username: null }, true);

                let response = await request
                .post(`/users`)
                .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'username',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if email is not a valid email address', async function() {

                const user = await UserFactory({ email: 'definitelyNotAnEmail' }, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'is not valid'
                });
            });

            it('returns an error if email is already in use', async function() {

                await UserFactory({ email: `me@me123.com` });
                const user = await UserFactory({ email: `me@me123.com` }, true);
                
                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'already in use'
                });
            });

            it('returns an error if password is blank', async function() {

                const user = await UserFactory({ password: null }, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if password contains less than 6 character', async function() {

                const user = await UserFactory({ password: 12345 }, true);

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());
                
                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot have less than 6 characters'
                });
            });
        });

        describe('POST /login', function() {
            it('returns a token when passing valid data', async function() {
                
                await UserFactory({ email: 'us@er.com', password: 'somepass' });

                let response = await request
                    .post(`/auth/login`)
                    .send({
                        email: 'us@er.com', 
                        password: 'somepass' 
                    });

                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(true);

                expect(response.body).to.have.property('token').to.not.be.null;
            });

            it('does not authenticate with invalid data', async function() {

                await UserFactory({ email: 'us@ere.com', password: 'somepass' });

                let response = await request
                    .post(`/auth/login`)
                    .send({
                        email: 'us@ere.com', 
                        password: 'wrongpass' 
                    });


                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(false);

                expect(response.body).to.have.property('token').to.be.null;
            });
        });

        describe('GET /users/{id}', function() {

            it('fetches a single user', async function() {

                let response = await request
                    .get(`/users/${users[0].id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);


                expect(response.body).to.have.property('email');
                expect(response.body.email).to.equal(users[0].email);
            });

            it("returns 404 if user hasn't been found", async function() {

                let response = await request
                    .get(`/users/99999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PUT /users/{id}', function() {

            it('updates a user', async function() {

                const updatedName = 'updated';

                await request
                    .put(`/users/${loggedUserId}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({last_name: updatedName});
                
                let response = await request
                    .get(`/users/${loggedUserId}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)

                expect(response.body.last_name).to.equal(updatedName);
            });

            it('returns 403 when trying to update someone else', async function() {

                const user = await UserFactory();
                const updatedName = 'updated';

                let response = await request
                    .put(`/users/${user.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({last_name : updatedName});


                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async function() {

                const updatedName = 'updated';

                let response = await request
                    .put(`/users/999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({last_name : updatedName});

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('DELETE /users/{id}', function() {
            it('deletes a user', async function() {

                let response = await request
                    .delete(`/users/${loggedUserId}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(204);
            });

            it('returns 403 when trying to delete someone else', async function() {

                const user = await UserFactory();

                let response = await request
                    .delete(`/users/${user.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async function() {

                let response = await request
                    .delete(`/users/9999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });
    });
});
