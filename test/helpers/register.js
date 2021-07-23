const UserFactory = require('../factories/user');

module.exports = async request => {
    const user = await UserFactory.generate();

    let response = await request.post('/auth/register').send(user);

    return response.body;
};
