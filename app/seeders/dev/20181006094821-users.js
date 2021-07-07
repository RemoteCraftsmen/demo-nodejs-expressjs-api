const faker = require('faker');
const bcrypt = require('bcryptjs');

const users = [];

for (let i = 1; i <= 4; i++) {
    const user = {
        userName: faker.internet.userName(),
        email: faker.internet.exampleEmail(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: bcrypt.hashSync('testing123'),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    users.push(user);
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', users);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users');
    }
};
