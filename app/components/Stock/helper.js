const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const serializer = require('./serializer').serializer;
const deserializer = require('./serializer').deserializer;

const StockHelper = {
  serializeMany(stocks) {
    let docs = stocks.map((stock) => {
      return stock.doc;
    });

    return new JSONAPISerializer('Stocks', serializer).serialize(docs);
  },

  serialize(stock) {
    return new JSONAPISerializer('Stocks', serializer).serialize(stock);
  },

  deserialize(stockData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(stockData, (err, deserializedStock) => {
      deserializedStock._id = deserializedStock.id;
      delete deserializedStock.id;

      callback(err, deserializedStock);
    });
  }
};

module.exports = StockHelper;
