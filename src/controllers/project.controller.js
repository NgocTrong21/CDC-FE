const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    let project = await db.Project.create(req.body);
    successHandler(res, { project }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.list = async (req, res) => {
  try {
    let projects = await db.Project.findAll({});
    successHandler(res, { projects }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
