const AbstractRepository = require('./AbstractRepository');

class UserRepository extends AbstractRepository {
    get model() {
        return this.db.User;
    }

    getByEmail(email, options = {}) {
        return this.model.findOne({
            ...options,
            where: { email }
        });
    }

    async getPassword(userId) {
        const { password } = await this.model.findByPk(userId, {
            attributes: ['password']
        });

        return password;
    }
}

module.exports = UserRepository;
