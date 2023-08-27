const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");
const qr = require("qrcode");

//Equipment Controller
exports.create = async (req, res) => {
  try {
    let data = req?.body;
    await db.sequelize.transaction(async (t) => {
      let equipmentInDB = await db.Equipment.findOne({
        where: {
          [Op.or]: [
            { model: data?.model },
            { serial: data?.serial }
          ]
        },
        attributes: ['id', 'model', 'serial']
      })
      if(equipmentInDB) return errorHandler(res, err.EQUIPMENT_FIELD_DUPLICATED);
      let equipment;
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "equipment",
        });
        equipment = await db.Equipment.create(
          { ...data, image: result?.secure_url },
          { transaction: t }
        );
      } else {
        equipment = await db.Equipment.create(data, { transaction: t });
      }
      let dataEq = { id: equipment.toJSON().id };
      let strJson = JSON.stringify(dataEq);
      qr.toDataURL(strJson, async (err, code) => {
        if (err) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
        const result = await cloudinary.uploader.upload(code, {
          folder: "equipment_qrcode",
        });
        equipment.qrcode = result?.secure_url;
        await equipment.save();
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const equipment = await db.Equipment.findOne({
      where: { id },
      include: [
        { model: db.Equipment_Type, attributes: ["id", "name"] },
        { model: db.Equipment_Unit, attributes: ["id", "name"] },
        { model: db.Equipment_Status, attributes: ["id", "name"] },
        { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
        { model: db.Department, attributes: ["id", "name"] },
        { 
          model: db.Equipment_Supply,
          attributes: ["equipment_id", "count"],
          include: [
            { model: db.Supply, attributes: ["id", "name", "code", "year_in_use", "year_of_manufacture"]}
          ]
        },
      ],
      raw: false,
    });
    return successHandler(res, { equipment }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    let data = req?.body;
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Equipment.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "equipment",
        });
        await db.Equipment.update(
          { ...data, image: result?.secure_url },
          { where: { id: data?.id }, transaction: t }
        );
      } else {
        await db.Equipment.update(data, {
          where: { id: data?.id },
          transaction: t,
        });
      }
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Equipment.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      await db.Equipment.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let {
      limit = 10,
      page,
      name,
      department_id,
      status_id,
      type_id,
      risk_level,
      year_in_use,
      year_of_manufacture,
    } = req?.query;
    let filter = {
      department_id,
      status_id,
      type_id,
      risk_level,
      year_in_use,
      year_of_manufacture,
    };

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { model: { [Op.like]: `%${name}%` } },
          { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      };
    }
    let include = [
      { model: db.Equipment_Type, attributes: ["id", "name"] },
      { model: db.Equipment_Unit, attributes: ["id", "name"] },
      { model: db.Equipment_Status, attributes: ["id", "name"] },
      { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
      { model: db.Department, attributes: ["id", "name"] },
      {
        model: db.Transfer,
        limit: 1,
        attributes: ["transfer_status"],
        order: [["createdAt", "DESC"]],
      },
    ];
    let equipments = await getList(limit, page, filter, "Equipment", include);
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.createByExcel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Equipment.bulkCreate(req.body, { transaction: t });
      return successHandler(res, {}, 200);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.statisticDashBoard = async (req, res) => {
  try {
    const equipments = await db.Equipment.findAll({
      attributes: ["id", "name", "risk_level", "status_id", "department_id"],
    });

    const levels = await db.Equipment_Risk_Level.findAll();
    const count_level = levels.map((x) => {
      let array = equipments.filter((y) => y.risk_level === x.id);
      return {
        type: x.name,
        value: array.length,
        risk_level: x.id,
      };
    });

    const departments = await db.Department.findAll({
      attributes: ["id", "name"],
    });
    const count_department = departments.map((x) => {
      let array = equipments.filter((y) => y.department_id === x.id);
      return {
        type: x.name,
        value: array.length,
        department_id: x.id,
      };
    });

    const status = await db.Equipment_Status.findAll();
    const count_status = status.map((x) => {
      let array = equipments.filter((y) => y.status_id === x.id);
      return {
        type: x.name,
        value: array.length,
        status_id: x.id,
      };
    });

    const count_broken = departments.map((x) => {
      let array = equipments.filter((y) => y.department_id === x.id && y.status_id === 4);
      return {
        type: x.name,
        value: array.length,
        department_id: x.id,
      };
    });

    const count_repair = departments.map((x) => {
      let array = equipments.filter((y) => y.department_id === x.id && y.status_id === 5);
      return {
        type: x.name,
        value: array.length,
        department_id: x.id,
      };
    });

    return successHandler(
      res,
      { count_department, count_level, count_status, count_broken, count_repair },
      200
    );
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};
