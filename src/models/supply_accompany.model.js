"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Accompany extends Model {
    static associate(models) {
      Supply_Accompany.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
      });
    }
  }
  Supply_Accompany.init(
    {
      name: DataTypes.STRING,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Supply_Accompany",
    }
  );
  return Supply_Accompany;
};
