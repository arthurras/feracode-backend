const equal = require('deep-equal');
const couch = require('./couchDB');
const async = require('async');

let schemaDefinitions = require('./SchemaDefinitions');

let views = [];
const databaseNames = schemaDefinitions.map((schema) => {
  return schema.database;
});

schemaDefinitions.forEach(function(schema) {
  views[schema.database] = require('../components/' + schema.component + '/view');
});

const Views = {

  populate(callback) {

    return async.each(databaseNames, (dbName, inCallback) => {
      return Views.populateDB(dbName, views, inCallback);
    }, callback);
  },

  populateDB(dbName, views, callback) {
    const database = couch.use(dbName);
    let dbViews = views[dbName];

    async.eachSeries(Object.keys(dbViews), (viewName, inCallback) => {
      Views.ensureView(viewName, dbName, dbViews, inCallback);
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
