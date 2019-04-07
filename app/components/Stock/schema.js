const extend = require('util')._extend;
const Joi = require('joi');

const StockSchema = {

  update: Joi.object().keys({
    _rev: Joi.string(),
    _id: Joi.string(),
    diaper: Joi.string(),
    size: Joi.string(),
    stock: Joi.number(),
    updatedAt: Joi.date(),
    createdAt: Joi.date()
  }),

  create: Joi.object().keys({
    diaper: Joi.string().required(),
    size: Joi.string().required(),
    stock: Joi.number(),
    createdAt: Joi.date()
  }),

};

module.exports = StockSchema;
