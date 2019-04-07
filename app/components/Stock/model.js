const config = require('config');
const DBErrors = require('../../helpers/DBErrors');
const schemas = require('../../database/Schemas');
const Stocks = require('../../database/couchdb').use('stocks');
const diff = require('object-versions').diff;
const extend = require('extend');

const StockModel = {

  create(stock, callback) {
    return schemas.validating('Stock', StockModel.save(stock, (err, savedStock) => {
      return StockModel.findById(savedStock.id, callback);
    }));
  },

  update(stock, callback) {
    return Stocks.get(stock._id, DBErrors.wrapNano((err, currentStock) => {
      if (err) {
        return callback(err);
      }

      let stockDiff = diff(currentStock, stock);

      return schemas.validate(stockDiff, 'Stock', 'update', (err) => {
        if (err) {
          return callback(err);
        }

        return Stocks.insert(stock, (err, savedStock) => {
          return StockModel.findById(savedStock.id, DBErrors.wrapNano(callback));
        });
      });
    }));
  },

  updateDiff(stockDiff, callback) {
    schemas.validate(stockDiff, 'Stock', 'update', function(err) {
      if (err) {
        return callback(err);
      }

      return StockModel.merge(stockDiff, callback);
    });
  },

  list(queryParams, callback) {
    return Stocks.fetch(queryParams, callback);
  },

  view(view, viewName, query, callback) {
    return Stocks.view(view,  viewName, query, callback);
  },

  save(stock, callback) {
    return Stocks.insert(stock, DBErrors.wrapNano(callback));
  },

  findById(id, callback) {
    return Stocks.get(id, callback);
  },

  merge(stockDiff, callback) {
    return Stocks.get(stockDiff._id, DBErrors.wrapNano(function(err, stock) {
      if (err) {
        return callback(err);
      }

      extend(stock, stockDiff);

      schemas.validate(stock, 'Stock', 'update', function(err) {
        if (err) {
          return callback(err);
        }

        return Stocks.insert(stock, DBErrors.wrapNano((err) => {
          return StockModel.done(err, stockDiff, (err, savedStock) => {
            return StockModel.findById(savedStock._id, DBErrors.wrapNano(callback));
          });
        }));
      });
    }));
  },

  done(err, stockDiff, callback) {
    if (err && err.statusCode == 409 && !stockDiff._rev) {
      StockModel.merge(stockDiff, callback); // try again
    }

    return callback(...arguments);
  }

};

module.exports = StockModel;
