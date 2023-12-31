'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            genderId: DataTypes.STRING,
            image: DataTypes.BLOB('long'),
            roleId: DataTypes.STRING,
            positionId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
