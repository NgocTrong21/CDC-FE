"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Equipment extends Model {
    static associate(models) {
      User_Equipment.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Equipment.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
      });
    }
  }
  User_Equipment.init(
    {
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_Equipment",
    }
  );
  return User_Equipment;
};
