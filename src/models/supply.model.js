"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply extends Model {
    static associate(models) {
      Supply.hasMany(models.Equipment_Supply, { foreignKey: "supply_id" });
      Supply.belongsTo(models.Supply_Type, {
        foreignKey: "type_id",
      });
      Supply.belongsTo(models.Equipment_Unit, {
        foreignKey: "unit_id",
      });
      Supply.belongsTo(models.Equipment_Risk_Level, {
        foreignKey: "risk_level",
      });
      Supply.belongsTo(models.Equipment_Status, {
        foreignKey: "status_id",
      });
    }
  }
  Supply.init(
    {
      name: DataTypes.STRING, // tên
      code: DataTypes.STRING, // mã số
      unit: DataTypes.STRING, // đơn vị
      quantity: DataTypes.INTEGER, // số lượng
      control_number: DataTypes.STRING, // số kiểm soát
      manufacturing_country: DataTypes.STRING, //nước sx
      expiration_date: DataTypes.DATE, //hạn sd
      note: DataTypes.TEXT, // ghi chú

      hash_code: DataTypes.STRING,
      count: DataTypes.INTEGER,
      image: DataTypes.STRING,
      technical_parameter: DataTypes.TEXT,
      warehouse_import_date: DataTypes.DATE,
      year_of_manufacture: DataTypes.INTEGER,
      year_in_use: DataTypes.INTEGER,
      configuration: DataTypes.TEXT,
      import_price: DataTypes.FLOAT,
      usage_procedure: DataTypes.TEXT,
      manufacturer: DataTypes.STRING,
      provider_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supply",
    }
  );
  return Supply;
};
