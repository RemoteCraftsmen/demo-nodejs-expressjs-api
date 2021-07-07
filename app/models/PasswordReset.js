const moment = require('moment');
const crypto = require('crypto');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PasswordReset extends Model {
        static associate(models) {
            PasswordReset.belongsTo(models.User, { as: 'user' });
        }

        async addToken(user) {
            const passwordReset = await PasswordReset.findOne({
                where: {
                    userId: user.id
                }
            });

            const token = PasswordReset.generateToken();
            const validUntil = moment().add(24, 'hours').toDate();

            if (passwordReset) {
                await passwordReset.update({
                    token,
                    validUntil
                });
            } else {
                await PasswordReset.create({
                    userId: user.id,
                    token,
                    validUntil
                });
            }

            return token;
        }

        generateToken() {
            return crypto.randomBytes(64).toString('hex');
        }

        getByToken(token) {
            return PasswordReset.findOne({
                where: { token },
                include: [{ association: 'user' }]
            });
        }

        hasExpired() {
            return moment(this.validUntil).isBefore(moment());
        }
    }

    PasswordReset.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            validUntil: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        { sequelize }
    );

    return PasswordReset;
};
