"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Equipment, {
        foreignKey: "project_id",
      });
      Project.hasMany(models.Supply, {
        foreignKey: "project_id",
      });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      describe: DataTypes.STRING,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
