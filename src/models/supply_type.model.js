"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Type extends Model {
    static associate(models) {
      Supply_Type.hasMany(models.Supply, { foreignKey: "type_id" });
    }
  }
  Supply_Type.init(
    {
      name: DataTypes.STRING,
      alias: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supply_Type",
    }
  );
  return Supply_Type;
};
