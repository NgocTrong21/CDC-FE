"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provider_Service extends Model {
    static associate(models) {
      Provider_Service.belongsTo(models.Provider, {
        foreignKey: "provider_id",
      });
      Provider_Service.belongsTo(models.Service, {
        foreignKey: "service_id",
      });
    }
  }
  Provider_Service.init(
    {
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Provider_Service",
    }
  );
  return Provider_Service;
};
