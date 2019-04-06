const equal = require('deep-equal');
const couch = require('./couchDB');
const async = require('async');

let schemaDefinitions = require('./SchemaDefinitions');

const Views = {

  populate(callback) {
    let views = [];
    const databaseNames = schemaDefinitions.map((schema) => {
      return schema.database;
    });

    schemaDefinitions.forEach(function(schema) {
      views[schema.database] = require('../components/' + schema.component + '/view');
    });

    return async.each(databaseNames, (dbName) => {
      return Views.populateDB(dbName, views, callback);
    }, callback);
  },

  populateDB(dbName, views, callback) {
    const database = couch.use(dbName);
    let dbViews = views[dbName];

    async.eachSeries(Object.keys(dbViews), (viewName, callback) => {
      return Views.ensureView(viewName, dbName, dbViews, callback);
    }, callback);
  },

  ensureView(viewName, dbName, dbViews, callback) {
    let database = couch.use(dbName);
    let view = dbViews[viewName];
    let ddocName = '_design/' + viewName;

    database.get(ddocName, function(err, ddoc) {
      if (err && err.statusCode == 404) {
        return Views.insertDDoc(database, view, viewName, ddocName, null, callback);
      }

      if (err) {
        return callback(err);
      }

      if (equal(ddoc.views[viewName], view)) {
        return callback();
      }

      return Views.insertDDoc(database, view, viewName, ddocName, ddoc, callback);
    });
  },

  insertDDoc(database, view, viewName, ddocName, ddoc, callback) {
    if (! ddoc) {
      ddoc = {
        language: 'javascript',
        views: {}
      };
    }

    ddoc.views[viewName] = view;
    return database.insert(ddoc, ddocName, function(err) {
      if (err && err.statusCode == 409) {
        return Views.ensureView(viewName, callback);
      }

      return callback(err);

    });
  }

};

module.exports = Views;
