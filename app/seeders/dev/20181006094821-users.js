const faker = require('faker');
const bcrypt = require('bcryptjs');

const users = [];

for (let i = 1; i <= 4; i++) {
    const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        password: bcrypt.hashSync('testing'),
        created_at: new Date(),
        updated_at: new Date()
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
