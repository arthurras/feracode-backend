const Boom = require('boom');
const Joi = require('joi');
const schemaDefinitions = require('./SchemaDefinitions');

let schemas = {};

schemaDefinitions.forEach(function(schema) {
  schemas[schema.component] = require('../components/' + schema.component + '/schema');
});

const DatabaseSchemas = {
  validate(doc, schema, op, callback) {
    if (typeof schema == 'string') {
      schema = schemas[schema];
    }

    if (schema) {
      schema = schema[op];
      
      if (! schema) {
        throw new Error('Undefined op ' + op);
      }

      return Joi.validate(doc, schema, callback);
    }

    return callback(new Error('Unknown schema'));
  },

  validating(schemaName, op, fn) {
    let schema = schemas[schemaName];

    if (!schema) {
      throw new Error('Unknown schema: ' + schemaName);
    }

    return function(doc, callback) {
      return DatabaseSchemas.validate(doc, schema, op, function(err, doc) {
        if (err) {
          Boom.wrap(err, 400);

          return callback(err);
        }

        return fn.call(null, doc, callback);
      });
    }
  }
};

module.exports = DatabaseSchemas;
