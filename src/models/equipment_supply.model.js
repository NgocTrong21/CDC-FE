"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment_Supply extends Model {
    static associate(models) {
      Equipment_Supply.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
      });
      Equipment_Supply.belongsTo(models.Supply, { foreignKey: "supply_id" });
    }
  }
  Equipment_Supply.init(
    {
      count: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Equipment_Supply",
    }
  );
  return Equipment_Supply;
};
