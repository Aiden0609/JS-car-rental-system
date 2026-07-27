'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const cars = []
    const counts = 50

    for (let i=0; i < counts; i++){
      const dailyRate = parseFloat((Math.random() * 1000 + 100).toFixed(2));
      const car = {
        licensePlate: `SPR-${i}`,
        brand: `Brand ${i}`,
        dailyRate: dailyRate,
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      cars.push(car)
    }
    await queryInterface.bulkInsert('Cars', cars, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};
