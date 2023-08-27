const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { sendReportEquipmentMail, reHandoverEmail } = require("../utils/sendEmail.util");
const { getList, getRoleEmailConfig } = require("../utils/query.util");

exports.reportEquipment = async (req, res) => {
  try {
    let data = req?.body;
    let roles = await getRoleEmailConfig(3);
    let dataEmail = {
      equipment_id: data?.equipment_id,
      equipment: data?.name,
      department: data?.department
    }
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id }
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);

    let users = await Promise.all(roles.map(async role => {
        let user = await db.User.findAll({
          where: {
            department_id: {
            [Op.or]: [1, +data?.department_id]
            },
          role_id: role.role_id
          },
        attributes: ['id', 'name', 'email']
        });
        return user;
    }))

    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Repair.create(data, { transaction: t }),
        await sendReportEquipmentMail(req, users.flat(), dataEmail),
        await db.Equipment.update(
          { status_id: 4 },
          {
            where: { id: data?.equipment_id },
            transaction: t
          }
        ),
        await db.Notification.create(
          {
            action_id: 3,
            user_id: data?.sender_id,
            equipment_id: data?.equipment_id,
            department_id: data?.department_id,
            is_seen: 0
          },
          { transaction: t }
        )
      ])
    });
    return successHandler(res, {}, 201);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getEquipmentRepair = async (req, res) => {
  try {
    let { id } = req?.query;

    const equipment = await db.Repair.findOne({
      where: {
        equipment_id: id,
      },
      include: [
        { model: db.User, attributes: ['id', 'name'], as: 'reporting_user' },
        { model: db.User, attributes: ['id', 'name'], as: 'schedule_create_user' },
        { model: db.User, attributes: ['id', 'name'], as: 'test_user' },
        {
          model: db.Equipment,
          attributes: ['id', 'name', 'model', 'serial', 'department_id'],
          include: [
            {
              model: db.Department, attributes: ['id', 'name']
            }
          ]
        }
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

// exports.getBrokenAndRepairEqList = async (req, res) => {
//   try {
//     let { limit = 10 } = req?.query;
//     let page = req?.query?.page;
//     let name = req?.query?.name;
//     let department_id = req?.query?.department_id;
//     let status_id = req?.query?.status_id;
//     let type_id = req?.query?.type_id;
//     let broken_report_date = req?.query?.broken_report_date;

//     let filter_broken = {
//       broken_report_date
//     }

//     for (let i in filter_broken) {
//       if (!filter_broken[i]) {
//         delete filter_broken[i];
//       }
//     }

//     let filter_equipment = {
//       department_id,
//       status_id,
//       type_id,
//     }

//     if (name) {
//       filter_equipment = {
//         ...filter_equipment,
//         name: { [Op.like]: `%${name}%` }
//       }
//     };

//     for (let i in filter_equipment) {
//       if (!filter_equipment[i]) {
//         delete filter_equipment[i];
//       }
//     }

//     let equipments = await db.Repair.findAndCountAll({
//       limit: limit,
//       offset: page > 1 ? limit * (page - 1) : 0,
//       where: { ...filter_broken },
//       include: [
//         {
//           model: db.Equipment,
//           where: {
//             [Op.or]: [
//               { status_id: 4 },
//               { status_id: 5 }
//             ],
//             ...filter_equipment
//           },
//           attributes: ['id', 'name', 'status_id', 'type_id', 'department_id'],
//           include: [
//             { model: db.Equipment_Type, attributes: ['id', 'name'] },
//             { model: db.Equipment_Status, attributes: ['id', 'name'] },
//             { model: db.Department, attributes: ['id', 'name'] }
//           ]
//         }
//       ],
//       raw: false
//     })
//     return successHandler(res, { equipments, count: equipments.length }, 200);
//   } catch (error) {
//     debugger;
//     console.log("___error___", error);
//     return errorHandler(res, error);
//   }
// }

exports.getBrokenAndRepairEqList = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let name = req?.query?.name;
    let department_id = req?.query?.department_id;
    let status_id = req?.query?.status_id;
    let type_id = req?.query?.type_id;
    let broken_report_date = req?.query?.broken_report_date;

    // let filter_broken = {
    //   broken_report_date
    // }

    // for (let i in filter_broken) {
    //   if (!filter_broken[i]) {
    //     delete filter_broken[i];
    //   }
    // }

    let filter_equipment = {
      department_id,
      status_id,
      type_id,
    }

    if (name) {
      filter_equipment = {
        ...filter_equipment,
        name: { [Op.like]: `%${name}%` }
      }
      };

    for (let i in filter_equipment) {
      if (!filter_equipment[i]) {
        delete filter_equipment[i];
      }
    }

    // let equipments = await db.Repair.findAndCountAll({
    //   limit: limit,
    //   offset: page > 1 ? limit * (page - 1) : 0,
    //   where: { ...filter_broken },
    //   include: [
    //     {
    //       model: db.Equipment,
    //       where: {
    //         [Op.or]: [
    //           { status_id: 4 },
    //           { status_id: 5 }
    //         ],
    //         ...filter_equipment
    //       },
    //       attributes: ['id', 'name', 'status_id', 'type_id', 'department_id'],
    //       include: [
    //         { model: db.Equipment_Type, attributes: ['id', 'name'] },
    //         { model: db.Equipment_Status, attributes: ['id', 'name'] },
    //         { model: db.Department, attributes: ['id', 'name'] }
    //       ]
    //     }
    //   ],
    //   raw: false
    // })

    let equipments = await db.Equipment.findAndCountAll({
      limit: limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      where: {
        ...filter_equipment,
        [Op.or]: [
          { status_id: 4 },
          { status_id: 5 }
        ],
      },
      attributes: ['id', 'name', 'status_id', 'type_id', 'department_id'],
      include: [
        { model: db.Equipment_Type, attributes: ['id', 'name'] },
            { model: db.Equipment_Status, attributes: ['id', 'name'] },
            { model: db.Department, attributes: ['id', 'name'] },
        {
          model: db.Repair,
          limit: 1,
          order: [["createdAt", "DESC"]],
        }
      ],
      raw: false
    })

    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.updateScheduleRepair = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Repair.update(
          req?.body,
          {
            where: { equipment_id: req?.body?.equipment_id, id:  req?.body?.id },
            transaction: t
          }
        ),
        await db.Equipment.update(
          { status_id: 5 },
          { where: { id: req?.body?.equipment_id }, transaction: t }
        )
      ])
      return successHandler(res, {}, 201);
    })
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getHistoryRepair = async (req, res) => {
  try {
    let { id } = req?.query;
    const [equipment, repair_info] = await Promise.all([
      await db.Equipment.findOne({
        where: { id }, attributes: ['id', 'name', 'model', 'serial'],
        include: [
          { model: db.Department, attributes: ['id', 'name'] }
        ],
        raw: false
      }),
      await db.Repair.findAll({
        where: { equipment_id: id },
        include: [
          { model: db.Provider, attributes: ['id', 'name'] },
          { model: db.Repair_Status, attributes: ['id', 'name'] }
        ],
        raw: false
      })
    ])
    return successHandler(res, { equipment, repair_info }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getRepairSchedule = async (req, res) => {
  try {
    const schedule = await db.Repair.findOne({
      where: {
        id: req?.query?.id,
      },
      include: [
        { model: db.User, attributes: ["id", "name"], as: "reporting_user" },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "schedule_create_user",
        },
        { model: db.User, attributes: ["id", "name"], as: "test_user" },
      ],
      raw: false,
    });
    return successHandler(res, { schedule }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.reHandoverEquipment = async (req, res) => {
  try {
    let data = req?.body;
    let roles = await getRoleEmailConfig(10);
    let users = await Promise.all(roles.map(async role => {
        let user = await db.User.findAll({
          where: {
            department_id: +data?.department_id,
          role_id: role.role_id
          },
        attributes: ['id', 'email']
        });
        return user;
    }))
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Equipment.update(
          { status_id: data?.status_id },
          { where: { id: data?.equipment_id }, transaction: t }
        ),
        await reHandoverEmail(req, users.flat(), data)
      ]);
      return successHandler(res, {}, 201);
    })
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}