const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasDepartment = await db.Department.findOne({
        where: { name: req?.body?.name }
      })
      if (isHasDepartment) return errorHandler(res, err.DEPARTMENT_DUPLICATED);
      await db.Department.create(req.body, { transaction: t });
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const department = await db.Department.findOne({
      where: { id },
      include: [
        {
          model: db.User, as: 'head', attributes: ['id', 'name']
        },
        {
          model: db.User, as: 'nurse', attributes: ['id', 'name']
        },
      ],
      raw: false,
    });

    let users = await db.User.findAll({
      where: { department_id: id },
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: db.Role, attributes: ['id', 'name']
        }
      ],
      raw: false,
    });

    let equipments = await db.Equipment.findAll({
      where: { department_id: id }
    });

    const status = await db.Equipment_Status.findAll();
    let count_status = await status.map(x => {
      let array = equipments.filter(y => y.status_id === x.id);
      return {
        type: x.name,
        value: array.length,
        status_id: x.id
      }
    })

    const levels = await db.Equipment_Risk_Level.findAll();
    let count_level = levels.map(x => {
      let array = equipments.filter(y => y.risk_level === x.id);
      return {
        type: x.name,
        value: array.length,
        risk_level: x.id
      }
    })

    return successHandler(res, { department, users, count_status, count_level }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.update = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasDepartment = await db.Department.findOne({
        where: { id: req?.body?.id }
      })
      if (!isHasDepartment) return errorHandler(res, err.DEPARTMENT_NOT_FOUND);

      await Promise.all([
        await db.Department.update(
          req.body,
          {
            where: { id: req?.body?.id },
            transaction: t
          }
        ),
        await db.User.update(
          { role_id: 6 },
          {
            where: { id: req?.body?.head_of_department_id },
            transaction: t
          }
        ),
        await db.User.update(
          { role_id: 4 },
          {
            where: { id: req?.body?.chief_nursing_id },
            transaction: t
          }
        ),
      ])
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasDepartment = await db.Department.findOne({
        where: { id: req?.body?.id }
      })
      if (!isHasDepartment) return errorHandler(res, err.DEPARTMENT_NOT_FOUND);
      await db.Department.destroy({
        where: { id: req?.body?.id },
        transaction: t
      });
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.search = async (req, res) => {
  try {
    let { limit = 10, page, keyword } = req?.query;
    let filter = {};
    if (keyword) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      }
    }
    let include = [
      { model: db.User, as: 'head', attributes: ['id', 'name'] },
      { model: db.User, as: 'nurse', attributes: ['id', 'name'] },
    ]
    let departments = await getList(limit, page, filter, 'Department', include);
    return successHandler(res, { departments, count: departments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.listEmployees = async (req, res) => {
  try {
    let { department_id } = req?.query;
    const employees = await db.User.findAll({
      where: { department_id },
      attributes: ['id', 'name']
    });
    return successHandler(res, { employees }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}
