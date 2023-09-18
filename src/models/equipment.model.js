"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Equipment_Unit, { foreignKey: "unit_id" });
      Equipment.belongsTo(models.Equipment_Status, { foreignKey: "status_id" });
      Equipment.belongsTo(models.Equipment_Type, { foreignKey: "type_id" });
      Equipment.belongsTo(models.Provider, { foreignKey: "provider_id" });
      Equipment.belongsTo(models.Project, { foreignKey: "project_id" });
      Equipment.belongsTo(models.Equipment_Risk_Level, {
        foreignKey: "risk_level",
      });
      Equipment.belongsTo(models.Department, { foreignKey: "department_id" });
      Equipment.hasMany(models.Handover, { foreignKey: "equipment_id" });
      Equipment.hasMany(models.Repair, { foreignKey: "equipment_id" });
      Equipment.hasMany(models.Liquidation, { foreignKey: "equipment_id" });
      Equipment.hasMany(models.Transfer, { foreignKey: "equipment_id" });
      Equipment.hasMany(models.Inspection, { foreignKey: "equipment_id" });
      Equipment.hasMany(models.Supply_Accompany, {
        foreignKey: "equipment_id",
      });
      Equipment.hasMany(models.Equipment_Supply, {
        foreignKey: "equipment_id",
      });
      Equipment.hasMany(models.Inventory, { foreignKey: "equipment_id" });
    }
  }
  Equipment.init(
    {
      name: DataTypes.STRING,
      model: DataTypes.STRING,
      serial: DataTypes.STRING,
      manufacturer_id: DataTypes.STRING, // hãng sản xuất
      manufacturing_country_id: DataTypes.STRING, // nước sản xuất
      year_in_use: DataTypes.INTEGER, // năm sử dụng
      fixed_asset_number: DataTypes.STRING, // số hiệu tscd
      hash_code: DataTypes.STRING,
      quantity: DataTypes.INTEGER, // số lượng
      initial_value: DataTypes.INTEGER, // giá trị ban đầu
      annual_depreciation: DataTypes.INTEGER, // khấu hao hàng năm
      residual_value: DataTypes.INTEGER, // Giá trị còn lại
      unit: DataTypes.STRING, // đơn vị tính nhập chữ
      note: DataTypes.TEXT,

      code: DataTypes.STRING,
      year_of_manufacture: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      qrcode: DataTypes.TEXT,
      technical_parameter: DataTypes.TEXT, //thong so ki thuat
      warehouse_import_date: DataTypes.DATE, // ngay nhap kho
      configuration: DataTypes.TEXT, // cau hinh thiet bi
      import_price: DataTypes.FLOAT,
      usage_procedure: DataTypes.TEXT, // quy trinh su dung
      joint_venture_contract_expiration_date: DataTypes.DATE, // ngay het han hop dong
      regular_maintenance: DataTypes.INTEGER, //bao duong dinh ki (6,12,24 thang)
      regular_inspection: DataTypes.INTEGER, //kiem dinh dinh ki
      regular_radiation_monitoring: DataTypes.INTEGER, // kiem dinh buc xa gan day
      regular_external_inspection: DataTypes.INTEGER,
      regular_room_environment_inspection: DataTypes.INTEGER,
      handover_date: DataTypes.DATE, //
    },
    {
      sequelize,
      modelName: "Equipment",
    }
  );
  return Equipment;
};
