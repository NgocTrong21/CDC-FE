"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Handover extends Model {
    static associate(models) {
      Handover.belongsTo(models.User, {
        foreignKey: "handover_in_charge_id",
        as: "handover_in_charge",
      });
      Handover.belongsTo(models.User, {
        foreignKey: "handover_create_id",
        as: "handover_create",
      });
      Handover.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
      });

      Handover.belongsTo(models.Department, {
        foreignKey: "department_id",
      });
    }
  }
  Handover.init(
    {
      handover_date: DataTypes.DATE,
      note: DataTypes.TEXT,
      file: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Handover",
    }
  );
  return Handover;
};
