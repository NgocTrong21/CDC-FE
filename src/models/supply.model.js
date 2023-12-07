"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply extends Model {
    static associate(models) {
      Supply.hasMany(models.Warehouse_Supply, {
        foreignKey: "supply_id",
      });
      Supply.hasMany(models.Supply_Inbound_Order, { foreignKey: "supply_id" });
      Supply.hasMany(models.Supply_Outbound_Order, { foreignKey: "supply_id" });
      Supply.belongsTo(models.Equipment_Unit, { foreignKey: "unit" });
    }
  }
  Supply.init(
    {
      name: DataTypes.STRING, // tên
      code: DataTypes.STRING, // mã số
      unit: DataTypes.STRING, // đơn vị tính
      unit_price: DataTypes.INTEGER, // đơn giá
      // control_number: DataTypes.STRING, // số kiểm soát
      lot_number: DataTypes.STRING, // số lô
      manufacturing_country: DataTypes.STRING, //nước sx
      expiration_date: DataTypes.DATE, //hạn sd
      note: DataTypes.TEXT, // ghi chú
      provider: DataTypes.STRING, // ghi chú
    },
    {
      sequelize,
      modelName: "Supply",
    }
  );
  return Supply;
};
