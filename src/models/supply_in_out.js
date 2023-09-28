"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_In_Out extends Model {
    static associate(models) {
      Supply_In_Out.belongsTo(models.Supply, {
        foreignKey: "supply_id",
      });
    }
  }
  Supply_In_Out.init(
    {
      quantity: DataTypes.INTEGER,
      date: DataTypes.DATE,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Supply_In_Out",
    }
  );
  return Supply_In_Out;
};
