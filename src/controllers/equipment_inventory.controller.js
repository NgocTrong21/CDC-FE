const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.getListEquipmentsOfDepartment = async (req, res) => {
  try {
    let { limit = 10, page, name, department_id } = req?.query;
    let filter = { department_id };
    if (name) {
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
      { model: db.Department, attributes: ['id', 'name'] },
      { model: db.Inventory }
    ]
    // let inventories = await db.Inventory.findAll({
    //   where: { status: 0 },
    //   // group: "times",
    //   include: [
    //     {
    //       model: db.Equipment, where: { department_id }, attributes: ['id', 'name', 'model', 'serial']
    //     }
    //   ],
    //   raw: true,
    //   nest: true
    // });
    // console.log('inventories', inventories)
    
    let attributes = ['id', 'code', 'name', 'model', 'serial']
    const equipments = await getList(limit, page, filter, 'Equipment', include, attributes);
    return successHandler(res, { equipments }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getHistoryInventoryOfDepartment = async (req, res) => {
  try {
    const { limit = 10, page, name, times, department_id } = req?.query;
    let filter_inventory = {};
    if(times) filter_inventory = { times };
    let filter_equipment = { department_id };
    if(name) filter_equipment = {
      ...filter_equipment,
      [Op.or]: [
        { name: { [Op.like]: `%${name}%` } },
        { model: { [Op.like]: `%${name}%` } },
        { serial: { [Op.like]: `%${name}%` } },
        { code: { [Op.like]: `%${name}%` } },
      ],
    }
    let equipments = await db.Inventory.findAndCountAll({
      limit: limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      where: { ...filter_inventory },
      include: [
        {
          model: db.Equipment,
          attributes: ['id', 'name', 'code', 'model', 'serial', 'department_id'],
          where: { ...filter_equipment },
          include: [
            { model: db.Department, attributes: ['id', 'name'] }
          ],
          raw: false
        }
      ],
      raw: false
    })
    return successHandler(res, { equipments }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getHistoryInventoryOfEquipment = async (req, res) => {
  try {
    const { limit = 10, page, equipment_id } = req?.query;
    let equipments = await db.Inventory.findAndCountAll({
      limit: limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      where: { equipment_id },
      include: [
        { model: db.User, attributes: ['id', 'name'], as: 'inventory_create_user' },
        { model: db.User, attributes: ['id', 'name'], as: 'inventory_approve_user' }
      ],
      raw: false
    })
    return successHandler(res, { equipments }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.createInventoryNotes = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const data = req.body;
      await db.Inventory.bulkCreate(data, { transaction: t });
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.updateInventoryNote = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const data = req.body;
      let equipment = await db.Inventory.update(
        {
          inventory_date: data.inventory_date,
          note: data.note
        },
        {
          where: { id: data.id, equipment_id: data.equipment_id, status: 0 },
          transaction: t
        }
      );
      if (!equipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      return successHandler(res, equipment, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getInventoryInfo = async (req, res) => {
  try {
    const { equipment_id } = req.query;
    const equipment = await db.Inventory.findOne({
      where: {
        equipment_id,
        status: 0
      },
      include: [
        { model: db.Equipment, attributes: ['id', 'name', 'model', 'serial'] },
        { model: db.User, attributes: ['id', 'name'], as: 'inventory_create_user' }
      ],
      raw: false
    })
    return successHandler(res, { equipment }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.approveInventoryNotes = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const data = req.body;
      await db.Inventory.update(
        { 
          status: 1,
          inventory_approve_user_id: data.inventory_approve_user
        },
        {
          where: {
            equipment_id: {
              [Op.in]: data.equipmentIds
            },
            times: data.times,
            status: 0
          },
          transaction: t
        }
      )
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}