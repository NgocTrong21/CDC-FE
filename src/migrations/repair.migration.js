'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Repairs', {
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
      code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      reason: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      reporting_person_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      broken_report_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      provider_id: {
        type: Sequelize.INTEGER,
      },
      repair_priority: {
        type: Sequelize.INTEGER,
      },
      schedule_repair_date: {
        type: Sequelize.DATE,
      },
      repair_date: {
        type: Sequelize.DATE,
      },
      repair_status: {
        type: Sequelize.INTEGER,
      },
      estimated_repair_cost: {
        type: Sequelize.DOUBLE,
      },
      repair_completion_date: {
        type: Sequelize.DATE,
      },
      actual_repair_cost: {
        type: Sequelize.DOUBLE,
      },
      schedule_create_user_id: {
        type: Sequelize.INTEGER,
      },
      test_user_id: {
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
    await queryInterface.dropTable('Repairs');
  }
};