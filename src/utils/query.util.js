const err = require("../errors/index");
const db = require("../models");
const { Op } = require("sequelize");

module.exports.getList = async (
  limit,
  page,
  filter,
  model,
  include,
  attributes = []
) => {
  try {
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
    let data = [];
    let query;
    if (attributes.length > 0) {
      query = {
        where: { ...filter },
        attributes,
        include,
        raw: false,
      };
    } else {
      query = {
        where: { ...filter },
        include,
        raw: false,
      };
    }
    if (page) {
      const offset = page > 1 ? limit * (page - 1) : 0;
      data = await db[model].findAndCountAll({
        limit: limit,
        offset,
        ...query,
      });
      console.log("pagr: " + data);
    } else {
      data = await db[model].findAll({
        ...query,
      });
      console.log("pagr2s2s: " + data);
    }
    return data;
  } catch (error) {
    return error;
  }
};

module.exports.getRoleEmailConfig = async (action_id) => {
  try {
    let data = await db.EmailConfig.findAll({
      where: { action_id, check: 1 },
      attributes: ["role_id"],
    });
    return data;
  } catch (error) {
    return error;
  }
};
