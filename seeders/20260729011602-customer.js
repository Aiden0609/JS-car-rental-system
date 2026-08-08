'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          name: 'John Doe',
          phone: '13800138001',
          driversLicense: 'DL110101199001011234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'John Smith',
          phone: '13900139002',
          driversLicense: 'DL110101199002021235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jane Doe',
          phone: '13700137003',
          driversLicense: 'DL110101199003031236',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Karen Birtch',
          phone: '13600136004',
          driversLicense: 'DL110101199004041237',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  },
};
