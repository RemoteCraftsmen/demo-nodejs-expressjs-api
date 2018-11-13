import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

export default class Auth {
    static signIn(user) {
        return jwt.sign({id: user.getDataValue('id')}, config.jwt.secret, {expiresIn: 60 * 60 * 24});
    }

    static checkCredentials(password, dbPassword) {
        return bcrypt.compareSync(password, dbPassword);
    }
}
