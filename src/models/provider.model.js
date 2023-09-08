"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    static associate(models) {
      Provider.hasMany(models.Provider_Service, { foreignKey: "provider_id" });
      Provider.hasMany(models.Repair, { foreignKey: "provider_id" });
      Provider.hasMany(models.Inspection, { foreignKey: "provider_id" });
    }
  }
  Provider.init(
    {
      name: DataTypes.STRING,
      tax_code: DataTypes.STRING,
      note: DataTypes.TEXT,
      image: DataTypes.STRING,
      contact_person: DataTypes.STRING,
      email: DataTypes.STRING,
      hotline: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Provider",
    }
  );
  return Provider;
};
