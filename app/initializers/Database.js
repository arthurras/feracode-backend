const async = require('async');
const couchDB = require('../database/couchDB');
const Views = require('../database/Views');

let schemaDefinitions = require('../database/SchemaDefinitions');

const DatabaseInitializer = {

  init(callback) {
    return async.series([DatabaseInitializer.createDatabases, DatabaseInitializer.createViews], callback);
  },

  createDatabases(callback) {
    let databaseNames = schemaDefinitions.map((schema) => {
      return schema.database;
    });

    return async.each(databaseNames, DatabaseInitializer.createDatabase, callback);
  },

  createDatabase(database, callback) {
    couchDB.db.create(database, function(err) {
      if (err && err.statusCode == 412) {
        err = null;
      }

      return callback(err);
    });
  },

  createViews(callback) {
    return Views.populate(callback);
  }

};

module.exports = DatabaseInitializer;
