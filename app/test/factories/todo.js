const faker = require('faker');
const {Todo} = require('../../models');

const generateData = async (props = {}) => {
    const defaultProps = {
        name: faker.lorem.word(),
        user_id: faker.random.number(),
        creator_id: faker.random.number()
    };

    return Object.assign({}, defaultProps, props);
};

module.exports = async (options = {}) => {
    let {make, props, raw} = options;

    if (Object.keys(options).length !== 0 && !('make' in options) && !('raw' in options) && !('props' in options)) {
        props = options;
    }

    if (raw) {
        return await generateData(props);
    }

    if (make) {
        return Todo.build(await generateData(props));
    }

    return Todo.create(await generateData(props));
};
