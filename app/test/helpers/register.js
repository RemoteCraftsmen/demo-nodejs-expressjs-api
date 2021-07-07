const UserFactory = require('../factories/user');

module.exports = async request => {
    const user = await UserFactory.generate();

    let response = await request.post('/users').send(user);

    return response.body;
};
