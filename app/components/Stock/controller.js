const Stock = require('./model');
const StockHelper = require('./helper');
const DBErrors = require('../../helpers/DBErrors');

const StockController = {

  list(req, res) {
    Stock.list({}, (err, result) => {
      if (err) {
        return res.json(err);
      }

      return res.json(StockHelper.serializeMany(result.rows));
    });

    // let viewParams = {
    //   include_docs: true,
    //   descending: true
    // };
    //
    // return Stock.view(
    //
    //   viewParams, DBErrors.wrapNano(function(err, result) {
    //     if (err) {
    //       return res.json(err);
    //     }
    //
    //     return res.json(StockHelper.serializeMany(result.rows));
    //   })
    // );
  },

  create(req, res) {
    return StockHelper.deserialize(req.body, (err, stockData) => {
      if (err) {
        return console.log(err);
      }

      stockData.createdAt = new Date();

      return Stock.create(stockData, (err, savedStock) => {
        res.json(StockHelper.serialize(savedStock));
      });
    });
  },

  update(req, res) {
    return StockHelper.deserialize(req.body, (err, stockData) => {
      return Stock.updateDiff(stockData, (err, savedStock) => {
        res.json(StockHelper.serialize(savedStock));
      });
    });
  }

};

module.exports = StockController;
