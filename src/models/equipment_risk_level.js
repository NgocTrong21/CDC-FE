"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment_Risk_Level extends Model {
    static associate(models) {
      Equipment_Risk_Level.hasMany(models.Equipment, {
        foreignKey: "risk_level",
      });
      Equipment_Risk_Level.hasMany(models.Supply, { foreignKey: "risk_level" });
    }
  }
  Equipment_Risk_Level.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Equipment_Risk_Level",
    }
  );
  return Equipment_Risk_Level;
};
