'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rentals', [
      {
        carId: 1,
        customerId: 1,
        expectedReturnDate: new Date('2026-07-24'),
        actualReturnDate: new Date('2026-07-24'),
        totalCost: 2000.00,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        carId: 2,
        customerId: 1,
        expectedReturnDate: new Date('2026-08-01'),
        actualReturnDate: new Date('2026-08-01'),
        totalCost: 3500.00,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        carId: 3,
        customerId: 2,
        expectedReturnDate: new Date('2026-08-05'),
        actualReturnDate: null,
        totalCost: null,
        status: 'ONGOING',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        carId: 4,
        customerId: 3,
        expectedReturnDate: new Date('2026-08-03'),
        actualReturnDate: new Date('2026-08-03'),
        totalCost: 1000.00,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        carId: 5,
        customerId: 4,
        expectedReturnDate: new Date('2026-08-09'),
        actualReturnDate: null,
        totalCost: null,
        status: 'ONGOING',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        carId: 6,
        customerId: 2,
        expectedReturnDate: new Date('2026-08-10'),
        actualReturnDate: null,
        totalCost: null,
        status: 'ONGOING',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rentals', null, {});
  }
};
