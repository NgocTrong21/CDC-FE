"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Outbound_Order, { foreignKey: "customer_id" });
    }
  }
  Customer.init(
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
      modelName: "Customer",
    }
  );
  return Customer;
};
