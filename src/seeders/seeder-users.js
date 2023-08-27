'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Users',
            [
                {
                    email: '123@gmail.com',
                    password: '123',
                    firstName: 'first name',
                    lastName: 'last name',
                    address: 'address',
                    phoneNumber: 'phone number',
                    gender: 'gender',
                    image: 'url image',
                    roleId: 'role id string',
                    positionId: 'position id string',

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
