const faker = require('faker');
const {User} = require('../../models');

const generateData = async (props = {}) => {
    const defaultProps = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        password: faker.internet.password()
    };

    return Object.assign({}, defaultProps, props);
};

module.exports = async (options = {}) => {
    let {make = false, props = {}, raw = false} = options;

    if (Object.keys(options).length !== 0 && !('make' in options) && !('raw' in options) && !('props' in options)) {
        props = options;
    }

    if (raw) {
        return await generateData(props);
    }

    if (make) {
        return User.build(await generateData(props));
    }

    return User.create(await generateData(props));
};
