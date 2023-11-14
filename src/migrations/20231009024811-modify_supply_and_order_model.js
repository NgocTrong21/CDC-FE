"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("supplies", "provider_id");
    await queryInterface.removeColumn("supplies", "quantity");

    await queryInterface.addColumn("inbound_orders", "provider", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("inbound_orders", "approve_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn("outbound_orders", "customer_id");
    await queryInterface.addColumn("outbound_orders", "customer", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("outbound_orders", "approve_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn("warehouse_supplies", "lot_number");

    await queryInterface.removeColumn(
      "supply_inbound_orders",
      "actual_quantity"
    );
    await queryInterface.removeColumn(
      "supply_inbound_orders",
      "defective_quantity"
    );
    await queryInterface.renameColumn(
      "supply_inbound_orders",
      "order_quantity",
      "quantity"
    );

    await queryInterface.removeColumn(
      "supply_outbound_orders",
      "actual_quantity"
    );
    await queryInterface.removeColumn(
      "supply_outbound_orders",
      "defective_quantity"
    );
    await queryInterface.renameColumn(
      "supply_outbound_orders",
      "order_quantity",
      "quantity"
    );
    await queryInterface.dropTable("receipt_notes");
    await queryInterface.dropTable("issuing_notes");
    await queryInterface.dropTable("customers");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
