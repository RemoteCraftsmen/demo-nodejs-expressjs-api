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
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            valid_until: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {underscored: true}
    );

    PasswordReset.associate = models => {
        PasswordReset.belongsTo(models.User, {as: 'user'});
    };

    PasswordReset.addToken = async user => {
        const passwordReset = await PasswordReset.findOne({
            where: {
                user_id: user.id
            }
        });

        const token = PasswordReset.generateToken();
        const valid_until = moment()
            .add(24, 'hours')
            .toDate();

        if (passwordReset) {
            await passwordReset.update({
                token,
                valid_until
            });
        } else {
            await PasswordReset.create({
                user_id: user.id,
                token,
                valid_until
            });
        }

        return token;
    };

    PasswordReset.generateToken = () => {
        return crypto.randomBytes(64).toString('hex');
    };

    PasswordReset.getByToken = async token => {
        return await PasswordReset.findOne({where: {token}, include: [{association: 'user'}]});
    };

    PasswordReset.prototype.hasExpired = () => {
        return moment(this.valid_until).isBefore(moment());
    };

    return PasswordReset;
};
