"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inspection extends Model {
    static associate(models) {
      Inspection.belongsTo(models.User, {
        foreignKey: "inspection_create_user_id",
        as: "inspection_create_user",
      });
      Inspection.belongsTo(models.User, {
        foreignKey: "inspection_approve_user_id",
        as: "inspection_approve_user",
      });
      Inspection.belongsTo(models.Equipment, { foreignKey: "equipment_id" });
      Inspection.belongsTo(models.Provider, { foreignKey: "provider_id" });
    }
  }
  Inspection.init(
    {
      code: DataTypes.TEXT,
      inspection_date: DataTypes.DATE,
      inspection_status: DataTypes.INTEGER,
      file: DataTypes.TEXT,
      html: DataTypes.TEXT,
      text: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Inspection",
    }
  );
  return Inspection;
};
