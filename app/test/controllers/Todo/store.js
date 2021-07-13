const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
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

    describe('POST /todos', () => {
        it('Registers a new todo and returns CREATED when passing valid data', async () => {
            const todo = await TodoFactory.create();

            let response = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: todo.name });

            expect(response.body)
                .to.have.property('creatorId')
                .to.equal(loggerUserId);

            expect(response.statusCode).to.equal(StatusCodes.CREATED);
        });

        it('Returns BAD_REQUEST if name is blank', async () => {
            let response = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: null });

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'name',
                message: 'cannot be blank'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
