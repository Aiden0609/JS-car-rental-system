'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rentals', 'startDate');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Rentals', 'startDate', {
      allowNull: false,
      type: Sequelize.DATE,
    });
  },
};
