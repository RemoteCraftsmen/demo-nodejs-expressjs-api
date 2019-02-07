const {expect} = require('chai');

const Register = require('./helpers/register');
const UserFactory = require('./factories/user');
const truncateDatabase = require('./helpers/truncate');

const app = require('../index');
const request = require('supertest')(app);

let users = [];
let loggedUserId = null;
let loggedUserToken = null;

describe('API', () => {
    before(async () => {
        await truncateDatabase();

        const {user, token} = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;

        users.push(await UserFactory());
        users.push(await UserFactory());
        users.push(await UserFactory());
    });

    describe('users', () => {
        describe('POST /users', () => {
            it('registers a new user when passing valid data', async () => {
                const user = await UserFactory({make: true});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(true);
            });

            it('returns an error if first_name is blank', async () => {
                const user = await UserFactory({make: true, props: {first_name: null}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'first_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if last_name is blank', async () => {
                const user = await UserFactory({make: true, props: {last_name: null}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'last_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if username is blank', async () => {
                const user = await UserFactory({make: true, props: {username: null}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'username',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if email is not a valid email address', async () => {
                const user = await UserFactory({make: true, props: {email: 'definitelyNotAnEmail'}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'is not valid'
                });
            });

            it('returns an error if email is already in use', async () => {
                await UserFactory({email: `me@me123.com`});
                const user = await UserFactory({make: true, props: {email: `me@me123.com`}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'already in use'
                });
            });

            it('returns an error if password is blank', async () => {
                const user = await UserFactory({make: true, props: {password: null}});

                let response = await request
                    .post(`/users`)
                    .send(user.toJSON());

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if password contains less than 6 character', async () => {
                const user = await UserFactory({make: true, props: {password: 12345}});

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

        describe('POST /login', () => {
            it('returns a token when passing valid data', async () => {
                await UserFactory({email: 'us@er.com', password: 'somepass'});

                let response = await request
                    .post(`/auth/login`)
                    .send({
                        email: 'us@er.com',
                        password: 'somepass'
                    });

                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(true);

                expect(response.body)
                    .to.have.property('token')
                    .to.not.be.null;
            });

            it('does not authenticate with invalid data', async () => {
                await UserFactory({email: 'us@ere.com', password: 'somepass'});

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

        describe('GET /users/{id}', () => {
            it('fetches a single user', async () => {
                let response = await request
                    .get(`/users/${users[0].id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);


                expect(response.body).to.have.property('email');
                expect(response.body.email).to.equal(users[0].email);
            });

            it("returns 404 if user hasn't been found", async () => {
                let response = await request
                    .get(`/users/99999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('PUT /users/{id}', () => {
            it('updates a user', async () => {
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

            it('returns 403 when trying to update someone else', async () => {
                const user = await UserFactory();
                const updatedName = 'updated';

                let response = await request
                    .put(`/users/${user.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({last_name: updatedName});


                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async () => {
                const updatedName = 'updated';

                let response = await request
                    .put(`/users/999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken)
                    .send({last_name: updatedName});

                expect(response.statusCode).to.equal(404);
            });
        });

        describe('DELETE /users/{id}', () => {
            it('deletes a user', async () => {
                let response = await request
                    .delete(`/users/${loggedUserId}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(204);
            });

            it('returns 403 when trying to delete someone else', async () => {
                const user = await UserFactory();

                let response = await request
                    .delete(`/users/${user.id}`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(403);
            });

            it("returns 404 if user hasn't been found", async () => {
                let response = await request
                    .delete(`/users/9999999`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(404);
            });
        });
    });
});
