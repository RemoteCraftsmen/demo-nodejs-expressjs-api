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
        it('registers CREATED sending valid data as USER', async () => {
            const todo = await TodoFactory.create();

            const { body, statusCode } = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: todo.name });

            expect(body).to.have.property('creatorId').to.equal(loggerUserId);
            expect(statusCode).to.equal(StatusCodes.CREATED);
        });

        it('returns BAD_REQUEST if name is blank as USER', async () => {
            const { body, statusCode } = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: null });

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                param: 'name',
                message: 'cannot be blank'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
