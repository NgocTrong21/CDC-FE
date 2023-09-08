"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.hasMany(models.Provider_Service, {
        foreignKey: "service_id",
      });
    }
  }
  Service.init(
    {
      name: DataTypes.STRING,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
