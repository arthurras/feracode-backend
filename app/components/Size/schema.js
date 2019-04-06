const extend = require('util')._extend;
const Joi = require('joi');

const SizeSchema = {
  update: Joi.object().keys({
    _rev: Joi.string(),
    _id: Joi.string(),
    model: Joi.string().min(3).max(100),
    description: Joi.string().max(255),
    updatedAt: Joi.date(),
    createdAt: Joi.date()
  }),

  create: Joi.object().keys({
    model: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(255),
    createdAt: Joi.date()
  }),
};

module.exports = SizeSchema;
