"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      Inventory.belongsTo(models.User, {
        foreignKey: "inventory_create_user_id",
        as: "inventory_create_user",
      });
      Inventory.belongsTo(models.User, {
        foreignKey: "inventory_approve_user_id",
        as: "inventory_approve_user",
      });
      Inventory.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
      });
    }
  }
  Inventory.init(
    {
      inventory_date: DataTypes.DATE,
      note: DataTypes.TEXT,
      times: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};
