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
  }
};

module.exports = StockHelper;
