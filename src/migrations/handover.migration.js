'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Handovers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      equipment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      handover_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      handover_in_charge_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      handover_create_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      department_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Handovers');
  }
};