const config = require('config');
const DBErrors = require('../../helpers/DBErrors');
const schemas = require('../../database/Schemas');
const Diapers = require('../../database/couchDB').use('diapers');
const diff = require('object-versions').diff;
const extend = require('extend');

const DiaperModel = {

  create(diaper, callback) {
    return schemas.validating('Diaper', DiaperModel.save(diaper, (err, savedDiaper) => {
      return DiaperModel.findById(savedDiaper.id, callback);
    }));
  },

  update(diaper, callback) {
    return Diapers.get(diaper._id, DBErrors.wrapNano((err, currentDiaper) => {
      if (err) {
        return callback(err);
      }

      let diaperDiff = diff(currentDiaper, diaper);

      return schemas.validate(diaperDiff, 'Diaper', 'update', (err) => {
        if (err) {
          return callback(err);
        }

        return Diapers.insert(diaper, (err, savedDiaper) => {
          return DiaperModel.findById(savedDiaper.id, DBErrors.wrapNano(callback));
        });
      });

    }));
  },

  updateDiff(diaperDiff, callback) {
    schemas.validate(diaperDiff, 'Diaper', 'update', function(err) {
      if (err) {
        return callback(err);
      }

      return DiaperModel.merge(diaperDiff, callback);
    });
  },

  list(queryParams, callback) {
    return Diapers.fetch(queryParams, callback);
  },

  view(view, viewName, query, callback) {
    return Diapers.view(view,  viewName, query, callback);
  },

  save(diaper, callback) {
    return Diapers.insert(diaper, DBErrors.wrapNano(callback));
  },

  findById(id, callback) {
    return Diapers.get(id, callback);
  },

  merge(diaperDiff, callback) {
    return Diapers.get(diaperDiff._id, DBErrors.wrapNano(function(err, diaper) {
      if (err) {
        return callback(err);
      }

      extend(diaper, diaperDiff);

      schemas.validate(diaper, 'Diaper', 'update', function(err) {
        if (err) {
          return callback(err);
        }

        return Diapers.insert(diaper, DBErrors.wrapNano((err) => {
          return DiaperModel.done(err, diaperDiff, (err, savedDiaper) => {
            return DiaperModel.findById(savedDiaper._id, DBErrors.wrapNano(callback));
          });
        }));
      });
    }));
  },

  done(err, diaperDiff, callback) {
    if (err && err.statusCode == 409 && !diaperDiff._rev) {
      DiaperModel.merge(diaperDiff, callback); // try again
    }

    return callback(...arguments);
  }

};

module.exports = DiaperModel;
