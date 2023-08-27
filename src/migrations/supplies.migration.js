'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Supplies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING
      },
      hash_code: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      risk_level: {
        type: Sequelize.INTEGER
      },
      unit_id: {
        type: Sequelize.INTEGER,
      },
      technical_parameter: {
        type: Sequelize.TEXT,
      },
      warehouse_import_date: {
        type: Sequelize.DATE,
      },
      year_of_manufacture: {
        type: Sequelize.INTEGER,
      },
      year_in_use: {
        type: Sequelize.INTEGER,
      },
      configuration: {
        type: Sequelize.TEXT,
      },
      import_price: {
        type: Sequelize.FLOAT,
      },
      usage_procedure: {
        type: Sequelize.TEXT,
      },
      expiration_date: {
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      status_id: {
        type: Sequelize.INTEGER,
      },
      manufacturer: {
        type: Sequelize.STRING,
      },
      manufacturing_country: {
        type: Sequelize.STRING,
      },
      provider_id: {
        type: Sequelize.INTEGER,
      },
      type_id: {
        type: Sequelize.INTEGER,
      },
      project_id: {
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
    await queryInterface.dropTable('Supplies');
  }
};