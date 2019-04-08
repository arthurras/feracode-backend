const extend = require('util')._extend;
const Joi = require('joi');

const OrderSchema = {

  update: Joi.object().keys({
    _rev: Joi.string(),
    _id: Joi.string(),
    diaper: Joi.string(),
    stock: Joi.string(),
    createdAt: Joi.date(),
    deletedAt: Joi.date()
  }),

  create: Joi.object().keys({
    diaper: Joi.string().required(),
    stock: Joi.string().required(),
    createdAt: Joi.date()
  }),

};

module.exports = OrderSchema;
