const config = require('config');
const DBErrors = require('../../helpers/DBErrors');
const schemas = require('../../database/Schemas');
const Sizes = require('../../database/couchdb').use('sizes');
const diff = require('object-versions').diff;
const extend = require('extend');

const SizeModel = {

  create(size, callback) {
    return schemas.validating('Size', SizeModel.save(size, (err, savedSize) => {
      return SizeModel.findById(savedSize.id, callback);
    }));
  },

  update(size, callback) {
    return Sizes.get(size._id, DBErrors.wrapNano((err, currentSize) => {
      if (err) {
        return callback(err);
      }

      let sizeDiff = diff(currentSize, size);

      return schemas.validate(sizeDiff, 'Size', 'update', (err) => {
        if (err) {
          return callback(err);
        }

        return Sizes.insert(size, (err, savedSize) => {
          return SizeModel.findById(savedSize.id, DBErrors.wrapNano(callback));
        });
      });

    }));
  },

  updateDiff(sizeDiff, callback) {
    schemas.validate(sizeDiff, 'Size', 'update', function(err) {
      if (err) {
        return callback(err);
      }

      return SizeModel.merge(sizeDiff, callback);
    });
  },

  list(queryParams, callback) {
    return Sizes.fetch(queryParams, callback);
  },

  view(view, viewName, query, callback) {
    return Sizes.view(view,  viewName, query, callback);
  },

  save(size, callback) {
    return Sizes.insert(size, DBErrors.wrapNano(callback));
  },

  findById(id, callback) {
    return Sizes.get(id, callback);
  },

  merge(sizeDiff, callback) {
    return Sizes.get(sizeDiff._id, DBErrors.wrapNano(function(err, size) {
      if (err) {
        return callback(err);
      }

      extend(size, sizeDiff);

      schemas.validate(size, 'Size', 'update', function(err) {
        if (err) {
          return callback(err);
        }

        return Sizes.insert(size, DBErrors.wrapNano((err) => {
          return SizeModel.done(err, sizeDiff, (err, savedSize) => {
            return SizeModel.findById(savedSize._id, DBErrors.wrapNano(callback));
          });
        }));
      });
    }));
  },

  done(err, sizeDiff, callback) {
    if (err && err.statusCode == 409 && !sizeDiff._rev) {
      SizeModel.merge(sizeDiff, callback); // try again
    }

    return callback(...arguments);
  }

};

module.exports = SizeModel;
