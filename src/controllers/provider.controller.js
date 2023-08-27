const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const provider = await db.Provider.create(req.body);
    let provider_service = req.body.services.map(item => {
      return {
        provider_id: provider.toJSON().id,
        service_id: item
      }
    });
    await db.Provider_Service.bulkCreate(provider_service);
    return successHandler(res, { provider }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.list = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let providers;
    if (page) {
      providers = await db.Provider.findAndCountAll({
        limit: limit,
        offset: page > 1 ? limit * (page - 1) : 0,
        include: [
          {
            model: db.Provider_Service, attributes: ['provider_id'],
            include: [
              {
                model: db.Service, attributes: ['id', 'name']
              }
            ],
            raw: false
          }
        ],
        raw: false
      });
    } else {
      providers = await db.Provider.findAll({
        include: [
          {
            model: db.Provider_Service, attributes: ['provider_id'],
            include: [
              {
                model: db.Service, attributes: ['id', 'name']
              }
            ],
            raw: false
          }
        ],
        raw: false
      })
    }
    return successHandler(res, { providers }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const provider = await db.Provider.findOne({
      where: { id },
      include: [
        {
          model: db.Provider_Service, attributes: ['provider_id'],
          include: [
            {
              model: db.Service, attributes: ['id', 'name']
            }
          ]
        }
      ],
      raw: false,
    });
    return successHandler(res, { provider }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.update = async (req, res) => {
  try {
    const provider = await db.Provider.update(req.body, {
      where: { id: req.body.id },
      raw: false
    });
    return successHandler(res, { provider }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.delete = async (req, res) => {
  try {
    await db.Provider.destroy({
      where: { id: req.body.id }
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.search = async (req, res) => {
  try {
    let { keyword } = req?.query;
    const providers = await db.Provider.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { tax_code: { [Op.like]: `%${keyword}%` } },
          { contact_person: { [Op.like]: `%${keyword}%` } },
          { hotline: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      }
    });
    return successHandler(res, { providers }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}
