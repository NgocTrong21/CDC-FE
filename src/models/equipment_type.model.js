"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment_Type extends Model {
    static associate(models) {
      Equipment_Type.hasMany(models.Equipment, { foreignKey: "type_id" });
      Equipment_Type.belongsTo(models.Equipment_Group, {
        foreignKey: "group_id",
      });
    }
  }
  Equipment_Type.init(
    {
      name: DataTypes.STRING,
      alias: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Equipment_Type",
    }
  );
  return Equipment_Type;
};
