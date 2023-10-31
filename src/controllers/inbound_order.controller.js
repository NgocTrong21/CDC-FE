const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    const { data, supplies } = req.body;
        let inbound_order;
    await db.sequelize.transaction(async (t) => {
      inbound_order = await db.Inbound_Order.create(
        { ...data, status_id: 1 },
        {
          transaction: t,
        }
      );

      for (const supply of supplies) {
        await db.Supply_Inbound_Order.create(
          {
            ...supply,
            inbound_order_id: inbound_order.id,
          },
          { transaction: t }
        );
      }
    });

    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.accept = async (req, res) => {
  try {
    const data = req.body;
    const inbound_order = await db.Inbound_Order.findOne({
      where: {
        id: data.id,
      },
      include: [
        {
          model: db.Supply_Inbound_Order,
          attributes: ["supply_id", "quantity"],
        },
      ],
      raw: false,
    });
    if (inbound_order.status_id !== 1) {
      return errorHandler(res, err.ORDER_APPROVED);
    } else {
      await db.sequelize.transaction(async (t) => {
        if (data.status === "accept") {
          await db.Inbound_Order.update(
            {
              status_id: 2,
              approve_date: data.date,
            },
            { where: { id: data.id }, transaction: t }
          );
          for (const item of inbound_order.Supply_Inbound_Orders) {
            const isHas = await db.Warehouse_Supply.findOne({
              where: {
                supply_id: item.supply_id,
                warehouse_id: inbound_order.warehouse_id,
              },
            });
            if (!isHas) {
              await db.Warehouse_Supply.create(
                {
                  supply_id: item.supply_id,
                  quantity: item.quantity,
                  warehouse_id: inbound_order.warehouse_id,
                },
                { transaction: t }
              );
            } else {
              await db.Warehouse_Supply.update(
                { quantity: Number(isHas.quantity) + Number(item.quantity) },
                {
                  where: {
                    id: isHas.id,
                  },
                  transaction: t,
                }
              );
            }
          }
        } else if (data.status === "reject") {
          await db.Inbound_Order.update(
            {
              status_id: 3,
              approve_date: data.date,
            },
            { where: { id: data.id }, transaction: t }
          );
        }
      });

      return successHandler(res, {}, 200);
    }
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const inbound_order = await db.Inbound_Order.findOne({
      where: { id },
      include: [
        {
          model: db.Supply_Inbound_Order,
          attributes: ["id", "quantity"],
          include: [
            {
              model: db.Supply,
              attributes: ["id", "name", "unit_price"],
            },
          ],
        },
      ],
      raw: false,
    });
    return successHandler(res, { inbound_order }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const { data, supplies } = req.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Inbound_Order.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
      await db.Inbound_Order.update(data, {
        where: { id: data?.id },
        transaction: t,
      });
      await db.Supply_Inbound_Order.destroy({
        where: { inbound_order_id: data?.id },
      });
      for (const supply of supplies) {
        await db.Supply_Inbound_Order.create(
          {
            ...supply,
            inbound_order_id: isHas.id,
          },
          { transaction: t }
        );
      }
    });

    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    const isHas = await db.Inbound_Order.findOne({
      where: { id: req.body.id },
    });
    if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
    await db.Supply_Inbound_Order.destroy({
      where: { inbound_order_id: req.body.id },
    });
    await db.Inbound_Order.destroy({
      where: { id: req.body.id },
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name, status_id, warehouse_id } = req?.query;

    // const { isHasRole, department_id_from_token } = await checkRoleFromToken(
    //   req
    // );

    // if (!isHasRole) {
    //   department_id = department_id_from_token;
    // }

    let filter = {
      status_id,
      warehouse_id,
    };

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [{ code: { [Op.like]: `%${name}%` } }],
      };
    }
    let include = [
      { model: db.Warehouse, attributes: ["id", "name"] },
      {
        model: db.Order_Note_Status,
        attributes: ["id", "name"],
      },
    ];
    let inbound_orders = await getList(
      +limit,
      page,
      filter,
      "Inbound_Order",
      include
    );
    return successHandler(
      res,
      { inbound_orders, count: inbound_orders.length },
      200
    );
  } catch (error) {
    return errorHandler(res, error);
  }
};
