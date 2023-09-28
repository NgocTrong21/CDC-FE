"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Inbound_Order extends Model {
    static associate(models) {
      Supply_Inbound_Order.belongsTo(models.Inbound_Order, {
        foreignKey: "inbound_order_id",
      });
      Supply_Inbound_Order.belongsTo(models.Supply, {
        foreignKey: "supply_id",
      });
    }
  }
  Supply_Inbound_Order.init(
    {
      order_quantity: DataTypes.INTEGER,
      actual_quantity: DataTypes.INTEGER,
      defective_quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supply_Inbound_Order",
    }
  );
  return Supply_Inbound_Order;
};
