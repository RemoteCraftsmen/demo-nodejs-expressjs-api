const faker = require('faker');

const di = require('../../di');
const userRepository = di.get('repositories.user');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        for (let i = 1; i <= 4; i++) {
            await userRepository.create({
                userName: faker.internet.userName(),
                email: faker.internet.exampleEmail(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: 'testing123',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users');
    }
};
