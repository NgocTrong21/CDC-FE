const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.getListMaintenanceEquipment = async (req, res) => {
  try {
    let { limit = 10, page, status_id, department_id, name } = req?.query;
    let filter = { 
      department_id, 
      status_id,
      regular_maintenance: {
        [Op.ne]: 0
      }
    };
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
    if(name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { model: { [Op.like]: `%${name}%` } },
          { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      }
    }

    let include = [
      { model: db.Department, attributes: ['id', 'name'] }
    ]
    let equipments = await getList(limit, page, filter, 'Equipment', include);
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}