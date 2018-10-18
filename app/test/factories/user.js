import bcrypt from 'bcryptjs';
import faker from 'faker';
import { User } from '../../models';

const generateData = async (props = {}) => {
    const defaultProps = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        password: bcrypt.hashSync(new Date().toString())
    };

    return Object.assign({}, defaultProps, props);
};

export default async (props = {}, make = false) => {
    if (make) {
        return User.build(await generateData(props));
    }

    return User.create(await generateData(props));
};
