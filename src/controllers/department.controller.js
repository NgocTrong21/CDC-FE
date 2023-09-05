const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasDepartment = await db.Department.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasDepartment) return errorHandler(res, err.DEPARTMENT_DUPLICATED);
      await db.Department.create(req.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req?.query;
    const department = await db.Department.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          where: { department_id: id },
          attributes: ["id", "name"],
          include: [{ model: db.Role, attributes: ["id", "name", "alias"] }],
        },
      ],
      raw: false,
    });

    return successHandler(res, { department }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.statisticEquipmentByDepartment = async (req, res) => {
  try {
    const { id } = req?.query;
    const equipments = await db.Equipment.findAll({
      where: { department_id: id },
    });

    const status = await db.Equipment_Status.findAll();
    const count_status = await status.map((x) => {
      const array = equipments.filter((y) => y.status_id === x.id);
      return {
        type: x.name,
        value: array.length,
        status_id: x.id,
      };
    });

    const levels = await db.Equipment_Risk_Level.findAll();
    const count_level = levels.map((x) => {
      const array = equipments.filter((y) => y.risk_level === x.id);
      return {
        type: x.name,
        value: array.length,
        risk_level: x.id,
      };
    });

    return successHandler(res, { count_status, count_level }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    await db.sequelize.transaction(async (t) => {
      const isHasDepartment = await db.Department.findOne({
        where: { id: data?.id },
      });
      if (!isHasDepartment) return errorHandler(res, err.DEPARTMENT_NOT_FOUND);

      await Promise.all([
        await db.Department.update(req.body, {
          where: { id: data?.id },
          transaction: t,
        }),
        await db.User.update(
          { role_id: data?.id === 1 ? 3 : 2 },
          {
            where: { id: data?.prevChiefId },
            transaction: t,
          }
        ),
        await db.User.update(
          { role_id: data?.id === 1 ? 8 : 4 },
          {
            where: { id: data?.chief_nursing_id },
            transaction: t,
          }
        ),
      ]);
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasDepartment = await db.Department.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasDepartment) return errorHandler(res, err.DEPARTMENT_NOT_FOUND);
      await db.Department.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    const { limit = 10, page, keyword } = req?.query;
    let filter = {};
    if (keyword) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }
    const include = [
      {
        model: db.User,
        where: {
          role_id: {
            [Op.or]: [4, 5, 6, 7, 8],
          },
        },
        attributes: ["id", "name"],
        include: [{ model: db.Role, attributes: ["id", "name", "alias"] }],
      },
    ];
    const departments = await getList(
      limit,
      page,
      filter,
      "Department",
      include
    );
    const departmentCount = await db.Department.count();
    return successHandler(res, { departments, count: departmentCount }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listEmployees = async (req, res) => {
  try {
    let { department_id } = req?.query;
    const employees = await db.User.findAll({
      where: { department_id },
      attributes: ["id", "name"],
    });
    return successHandler(res, { employees }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
