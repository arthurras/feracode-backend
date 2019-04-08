const DBErrors = require('../../helpers/DBErrors');
const Order = require('../Order/model');
const SizeHelper = require('../Size/helper');
const Stock = require('./model');
const StockHelper = require('./helper');

const StockController = {

  list(req, res) {
    let viewParams = {
      include_docs: true,
      descending: true
    };

    return Stock.view(
      'by_diaper', 'by_diaper',
      viewParams, DBErrors.wrapNano(function(err, result) {
        if (err) {
          return res.json(err);
        }

        return res.json(StockHelper.serializeMany(result.rows));
      })
    );
  },

  one(req, res) {
    StockHelper.findByIdWithOrdersNumber(req.params.stock_id, (err, foundedStock) => {
      if (err) {
        return res.json(err);
      }

      return res.json(StockHelper.serialize(foundedStock));
    });
  },

  create(req, res) {
    return StockHelper.deserialize(req.body, (err, stockData) => {
      if (err) {
        return console.log(err);
      }

      stockData.createdAt = new Date();
      return SizeHelper.sizeForStock(stockData, (err, size) => {
        let normalizedStock = StockHelper.normalizeData(stockData);

        normalizedStock.size = size;
        return Stock.create(stockData, (err, savedStock) => {
          res.json(StockHelper.serialize(savedStock));
        });
      });
    });
  },

  update(req, res) {
    return StockHelper.deserialize(req.body, (err, stockData) => {
      return SizeHelper.sizeForStock(stockData, (err, size) => {
        let normalizedStock = StockHelper.normalizeData(stockData);

        normalizedStock.size = size;

        return Stock.updateDiff(normalizedStock, (err, savedStock) => {
          res.json(StockHelper.serialize(savedStock));
        });
      });
    });
  }

};

module.exports = StockController;
