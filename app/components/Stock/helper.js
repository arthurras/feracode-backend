const deserializer = require('./serializer').deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const moment = require('moment');
const Order = require('../Order/model');
const serializer = require('./serializer').serializer;
const Stock = require('./model');
const _ = require('lodash');

const StockHelper = {
  serializeMany(stocks) {
    let docs = stocks.map((stock) => {
      return stock.doc;
    });

    return new JSONAPISerializer('Stocks', serializer).serialize(docs);
  },

  serialize(stock) {
    return new JSONAPISerializer('Stocks', serializer).serialize(StockHelper._prepareToSerialize(stock));
  },

  _prepareToSerialize(stock) {
    if (stock.size) {
      stock.size = { type: 'sizes', id: stock.size };
    }

    if (stock.diaper) {
      stock.diaper = { type: 'diapers', id: stock.diaper };
    }

    return stock;
  },

  deserialize(stockData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(StockHelper._prepareToDeserialize(stockData), (err, deserializedStock) => {
      deserializedStock._id = deserializedStock.id;
      delete deserializedStock.id;

      callback(err, deserializedStock);
    });
  },

  _prepareToDeserialize(stockData) {
    if (stockData.data.diaper) {
      stockData.data.relationships.diaper = stockData.data.diaper;
    }

    if (stockData.data.size) {
      stockData.data.relationships.size = stockData.data.size;
    }

    return stockData;
  },

  normalizeData(stockData) {
    delete stockData['size-name'];

    return stockData;
  },

  findByIdWithOrdersNumber(stock_id, callback) {
    Stock.findById(stock_id, (err, foundedStock) => {
      if (err) {
        return callback(err, null);
      }

      Order.view(
        'orders_number_for_stock', 'orders_number_for_stock',
        { key: stock_id }, (err, result) => {
          let totalOrders = 0;
          if (result && result.rows && result.rows.length) {
            totalOrders = result.rows[0].value;
          }

          foundedStock.totalOrders = totalOrders;

          callback(err, foundedStock);
        }
      );
    });
  },

  decreaseStock(order, callback) {
    return Stock.findById(order.stock, (err, foundedStock) => {
      if (err) {
        return callback(err);
      }

      if (foundedStock.stock > 0) {
        foundedStock.stock = foundedStock.stock - 1;

        return StockHelper.updatedTimeToZero(foundedStock, (err, foundedStock) => {
          return Stock.update(foundedStock, (err, savedStock) => {
            if (err && err.statusCode === 409) {
              return StockHelper.decreaseStock(order, callback);
            }

            callback(err, savedStock);
          });
        });

      }

      return callback('Insuficient stock');
    });
  },

  updatedTimeToZero(stock, callback) {
    return Order.view(
      'order_by_stock', 'order_by_stock',
      {key: stock._id}, (err, foundedOrders) => {

        let timeDiff = 0;
        let zeroedInMinutes = 0;
        if (foundedOrders && foundedOrders.rows) {
          let totalOrders = foundedOrders.rows.length;

          if (totalOrders >= 1) {
            //Add the current order (not saved yet)
            totalOrders + 1;

            let sortedOrders = _.sortBy(foundedOrders.rows, 'value.createdAt');
            let firstOrderDateTime = sortedOrders[0].value.createdAt;

            // Use the current date time as last date time to compare (current order)
            let lastOrderDateTime = new Date();

            timeDiff = moment(lastOrderDateTime).diff(moment(firstOrderDateTime), 'seconds');

            zeroedInMinutes = StockHelper._calculateZeroedInMinutes(timeDiff, totalOrders, stock.stock);
          }
        }

        stock.zeroedInMinutes = zeroedInMinutes;

        callback(err, stock);
      }
    );
  },

  _calculateZeroedInMinutes(timeDiff, totalOrders, stock) {
    //Calculate total time in seconds by order
    let zeroedInMinutes = timeDiff / totalOrders;

    //Convert to minutes
    zeroedInMinutes = zeroedInMinutes / 60;

    //Multiply by stock and get the total time in minutes
    zeroedInMinutes = Math.round(zeroedInMinutes * stock);

    return zeroedInMinutes;
  }
};

module.exports = StockHelper;
