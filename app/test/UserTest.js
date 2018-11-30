import { assert, should, expect } from 'chai';

import Setup from './Setup';
import jwt from 'jsonwebtoken';
import UserFactory from './factories/user';
import truncateDatabase from './truncate';

let server;
let API;
let users = [];
let user_id;

describe('API', function() {
    before(async function() {
        server = require('../index');

        truncateDatabase();
        let { client, token } = await Setup.API(false);

        API = client;

        users.push(await UserFactory());
        users.push(await UserFactory());
        users.push(await UserFactory());
    });

    describe('users', function() {
        describe('POST /users', function() {
            it('registers a new user when passing valid data', async function() {
                const user = await UserFactory({}, true);

                const { data } = await API.post(`/users`, user);

                expect(data)
                    .to.have.property('auth')
                    .to.equal(true);
            });

            it('returns an error if first_name is blank', async function() {
                let data;

                const user = await UserFactory({ first_name: null }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'first_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if last_name is blank', async function() {
                let data;

                const user = await UserFactory({ last_name: null }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'last_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if username is blank', async function() {
                let data;

                const user = await UserFactory({ username: null }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'username',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if email is not a valid email address', async function() {
                let data;

                const user = await UserFactory({ email: 'definitelyNotAnEmail' }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'email',
                    message: 'is not valid'
                });
            });

            it('returns an error if email is already in use', async function() {
                let data;

                await UserFactory({ email: `me@me123.com` });
                const user = await UserFactory({ email: `me@me123.com` }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'email',
                    message: 'already in use'
                });
            });

            it('returns an error if password is blank', async function() {
                let data;
                const user = await UserFactory({ password: null }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if password contains less than 6 character', async function() {
                let data;

                const user = await UserFactory({ password: 12345 }, true);

                try {
                    let { data } = await API.post(`/users`, user);
                } catch (e) {
                    data = e.response.data;
                }

                expect(data).to.have.property('errors');
                expect(data.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot have less than 6 characters'
                });
            });
        });

        describe('POST /login', function() {
            it('returns a token when passing valid data', async function() {
                const user = await UserFactory({ email: 'us@er.com', password: 'somepass' });

                const { data } = await API.post(`/auth/login`, { email: 'us@er.com', password: 'somepass' });

                expect(data)
                    .to.have.property('auth')
                    .to.equal(true);

                expect(data).to.have.property('token').to.not.be.null;
            });

            it('does not authenticate with invalid data', async function() {
                let data;

                await UserFactory({ email: 'us@ere.com', password: 'somepass' });

                try {
                    let { data } = await API.post(`/auth/login`, {
                        email: 'us@ere.com',
                        password: 'nopityNope'
                    });
                } catch (e) {
                    data = e.response.data;
                }

                expect(data)
                    .to.have.property('auth')
                    .to.equal(false);

                expect(data).to.have.property('token').to.be.null;
            });
        });

        describe('GET /users/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('fetches a single user', async function() {
                const { data } = await API.get(`/users/${users[0].id}`);

                expect(data).to.have.property('email');
                expect(data.email).to.equal(users[0].email);
            });

            it("returns 404 if user hasn't been found", async function() {
                let status;

                try {
                    await API.get(`/users/99999`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });

        describe('PUT /users/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('updates a user', async function() {
                await API.put(`/users/${user_id}`, { last_name: 'upd' });

                const { data } = await API.get(`/users/${user_id}`);

                assert.equal(data.last_name, 'upd');
            });

            it('returns 403 when trying to update someone else', async function() {
                let status;

                const user = await UserFactory();

                try {
                    await API.put(`/users/${user.id}`, { last_name: 'updated' });
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async function() {
                let status;

                try {
                    await API.put(`/users/99999`, { last_name: 'updated' });
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });

        describe('DELETE /users/{id}', function() {
            before(async function() {
                let { client, token } = await Setup.API();

                API = client;

                let decoded = jwt.decode(token);

                user_id = decoded.id;
            });

            it('deletes a user', async function() {
                const response = await API.delete(`/users/${user_id}`, { last_name: 'upd' });

                expect(response.status).to.equal(204);
            });

            it('returns 403 when trying to delete someone else', async function() {
                let status;

                const user = await UserFactory();

                try {
                    await API.delete(`/users/${user.id}`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async function() {
                let status;

                try {
                    await API.delete(`/users/99999`);
                } catch (err) {
                    status = err.response.status;
                }

                expect(status).to.equal(404);
            });
        });
    });
});
