'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Equipment', {
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
      model: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      serial: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING
      },
      hash_code: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      qrcode: {
        type: Sequelize.TEXT
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
      initial_value: {
        type: Sequelize.FLOAT,
      },
      annual_depreciation: {
        type: Sequelize.FLOAT,
      },
      usage_procedure: {
        type: Sequelize.TEXT,
      },
      joint_venture_contract_expiration_date: {
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      status_id: {
        type: Sequelize.INTEGER,
      },
      manufacturer_id: {
        type: Sequelize.STRING,
      },
      manufacturing_country_id: {
        type: Sequelize.STRING,
      },
      supplier_id: {
        type: Sequelize.INTEGER,
      },
      type_id: {
        type: Sequelize.INTEGER,
      },
      department_id: {
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
      },
      regular_maintenance: {
        type: Sequelize.INTEGER,
      },
      regular_inspection: {
        type: Sequelize.INTEGER,
      },
      regular_radiation_monitoring: {
        type: Sequelize.INTEGER,
      },
      regular_external_inspection: {
        type: Sequelize.INTEGER,
      },
      regular_room_environment_inspection: {
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
    await queryInterface.dropTable('Equipment');
  }
};