const moment = require('moment');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const PasswordReset = sequelize.define(
        'PasswordReset',
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
        { tableName: 'PasswordResets' }
    );

    PasswordReset.associate = models => {
        PasswordReset.belongsTo(models.User, { as: 'user' });
    };

    PasswordReset.addToken = async user => {
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
    };

    PasswordReset.generateToken = () => {
        return crypto.randomBytes(64).toString('hex');
    };

    PasswordReset.getByToken = async token => {
        return await PasswordReset.findOne({
            where: { token },
            include: [{ association: 'user' }]
        });
    };

    PasswordReset.prototype.hasExpired = () => {
        return moment(this.validUntil).isBefore(moment());
    };

    return PasswordReset;
};
