import { User } from '../models';
import Auth from '../services/Auth';

export default class AuthController {
    login(request, response, next) {
        const { email, password } = request.body;

        User.findOne({ where: { email }, attributes: ['id', 'username', 'first_name', 'last_name', 'email', 'password'] })
            .then(user => {
                if (!user) {
                    return response.status(401).json({ auth: false, token: null });
                }

                if (Auth.checkCredentials(password, user.getDataValue('password'))) {
                    const token = Auth.signIn(user);
                    let plainUser = user.get({ plain: true });
                    delete plainUser.password;

                    return response.json({ auth: true, token, user: plainUser });
                }

                return response.status(401).json({ auth: false, token: null, user: null });
            })
            .catch(error => {
                console.error(error);
                return response.status(401).json({ auth: false, token: null, user: null });
            });
    }
}
