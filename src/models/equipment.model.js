'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Equipment_Unit, { foreignKey: 'unit_id', targetKey: 'id' });
      Equipment.belongsTo(models.Equipment_Status, { foreignKey: 'status_id', targetKey: 'id' });
      Equipment.belongsTo(models.Equipment_Type, { foreignKey: 'type_id', targetKey: 'id' });
      Equipment.belongsTo(models.Equipment_Risk_Level, { foreignKey: 'risk_level', targetKey: 'id' });
      Equipment.belongsTo(models.Department, { foreignKey: 'department_id', targetKey: 'id' });
      Equipment.hasOne(models.Handover, { foreignKey: 'equipment_id' });
      Equipment.hasMany(models.Repair, { foreignKey: 'equipment_id' });
      Equipment.hasOne(models.Liquidation, { foreignKey: 'equipment_id' });
      Equipment.hasMany(models.Transfer, { foreignKey: 'equipment_id' });
      Equipment.belongsToMany(models.Supply, {
        through: models.Equipment_Supply,
        foreignKey: 'equipment_id',
        otherKey: 'supply_id'
      });
      Equipment.hasMany(models.Equipment_Supply, { foreignKey: 'equipment_id' });
      Equipment.hasMany(models.Inventory, { foreignKey: 'equipment_id' });
    }
  }
  Equipment.init({
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    serial: DataTypes.STRING,
    code: DataTypes.STRING,
    hash_code: DataTypes.STRING,
    image: DataTypes.TEXT,
    qrcode: DataTypes.TEXT,
    risk_level: DataTypes.INTEGER,
    unit_id: DataTypes.INTEGER,
    technical_parameter: DataTypes.TEXT,
    warehouse_import_date: DataTypes.DATE,
    year_of_manufacture: DataTypes.INTEGER,
    year_in_use: DataTypes.INTEGER,
    configuration: DataTypes.TEXT,
    import_price: DataTypes.FLOAT,
    initial_value: DataTypes.FLOAT,
    annual_depreciation: DataTypes.FLOAT,
    usage_procedure: DataTypes.TEXT,
    joint_venture_contract_expiration_date: DataTypes.DATE,
    note: DataTypes.TEXT,
    status_id: DataTypes.INTEGER,
    manufacturer_id: DataTypes.STRING,
    manufacturing_country_id: DataTypes.STRING,
    supplier_id: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    regular_maintenance: DataTypes.INTEGER,
    regular_inspection: DataTypes.INTEGER,
    regular_radiation_monitoring: DataTypes.INTEGER,
    regular_external_inspection: DataTypes.INTEGER,
    regular_room_environment_inspection: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Equipment',
  });
  return Equipment;
};