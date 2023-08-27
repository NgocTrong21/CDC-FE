const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { getList } = require("../utils/query.util");
const { verifyAccessToken } = require("../utils/auth.util");
const salt = bcrypt.genSaltSync(10);

exports.detail = async (req, res) => {
  try {
    let { id } = req.query;
    let user = await db.User.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      },
      include: [
        { model: db.Role, attributes: ['id', 'name'] },
        { model: db.Department, attributes: ['id', 'name'] }
      ],
      raw: false
    })
    return successHandler(res, { user }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const access_token = req?.headers?.authorization?.split(" ")[1];
    const data = await verifyAccessToken(access_token);
    if(+data?.data?.id !== +id) return errorHandler(res, err.NOT_AUTHORIZED);
    let user = await db.User.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      },
      include: [
        { model: db.Role, attributes: ['id', 'name'] },
        { model: db.Department, attributes: ['id', 'name'] }
      ],
      raw: false
    })
    return successHandler(res, { user }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.create = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasUser = await db.User.findOne({
        where: { email: req?.body?.email }
      });
      if (isHasUser) return errorHandler(res, err.EMAIL_DUPLICATED);
      let defaultPassword = "123456";
      let hashPassword = bcrypt.hashSync(defaultPassword, salt);
      const user = await db.User.create({
        ...req?.body,
        password: hashPassword
      }, { transaction: t });
      const department = await db.Department.findOne({
        where: { id: req?.body?.department_id },
        raw: false
      });
      if(req?.body?.role_id === 4) {
        department.chief_nursing_id = user.toJSON().id
      }
      if(req?.body?.role_id === 6) {
        department.head_of_department_id = user.toJSON().id
      };
      await department.save();
      return successHandler(res, { user }, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.update = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasUser = await db.User.findOne({
        where: { id: req?.body?.id }
      });
      if (!isHasUser) return errorHandler(res, err.USER_NOT_FOUND);
      await db.User.update(req.body,
        {
          where: { id: req?.body?.id },
          transaction: t
        }
      );
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
      let isHasUser = await db.User.findOne({
        where: { id: req?.body?.id }
      });
      if (!isHasUser) return errorHandler(res, err.USER_NOT_FOUND);
      await db.User.destroy({
        where: { id: req?.body?.id },
        transaction: t
      });
      return successHandler(res, {}, 200);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.search = async (req, res) => {
  try {
    let { limit = 10, page, keyword, role_id, department_id } = req?.query;
    let filter = { role_id, department_id }
    if(keyword) {
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
      { model: db.Role, attributes: ['id', 'name'] },
      { model: db.Department, attributes: ['id', 'name'] }
    ]
    let users = await getList(limit, page, filter, 'User', include)
    return successHandler(res, { users, count: users.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.uploadExcel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Equipment_Type.bulkCreate(req.body, { transaction: t })
      return successHandler(res, {}, 200);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}