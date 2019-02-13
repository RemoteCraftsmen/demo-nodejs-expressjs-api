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

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
    });

    describe('users', () => {
        describe('POST /users', () => {
            it('registers a new user when passing valid data', async () => {
                const userData = UserFactory.generate();

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body)
                    .to.have.property('auth')
                    .to.equal(true);
            });

            it('returns an error if first_name is blank', async () => {
                const userData = await UserFactory.generate({first_name: null});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'first_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if last_name is blank', async () => {
                const userData = await UserFactory.generate({last_name: null});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'last_name',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if username is blank', async () => {
                const userData = await UserFactory.generate({username: null});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'username',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if email is not a valid email address', async () => {
                const userData = await UserFactory.generate({email: 'definitelyNotAnEmail'});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'is not valid'
                });
            });

            it('returns an error if email is already in use', async () => {
                await UserFactory.create({email: `me@me123.com`});
                const userData = await UserFactory.generate({email: `me@me123.com`});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'email',
                    message: 'already in use'
                });
            });

            it('returns an error if password is blank', async () => {
                const userData = await UserFactory.generate({password: null});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot be blank'
                });
            });

            it('returns an error if password contains less than 6 character', async () => {
                const userData = await UserFactory.generate({password: 12345});

                let response = await request
                    .post(`/users`)
                    .send(userData);

                expect(response.body).to.have.property('errors');
                expect(response.body.errors).to.deep.include({
                    param: 'password',
                    message: 'cannot have less than 6 characters'
                });
            });
        });

        describe('POST /login', () => {
            it('returns a token when passing valid data', async () => {
                await UserFactory.create({email: 'us@er.com', password: 'somepass'});

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
                await UserFactory.create({email: 'us@ere.com', password: 'somepass'});

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
                const user = await UserFactory.create();
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
                const user = await UserFactory.create();

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
