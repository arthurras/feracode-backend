const deserializer = require('./serializer').deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const Size = require('./model');
const serializer = require('./serializer').serializer;

const SizeHelper = {
  serializeMany(sizes) {
    let docs = sizes.map((size) => {
      return size.doc;
    });

    return new JSONAPISerializer('Sizes', serializer).serialize(docs);
  },

  serialize(size) {
    return new JSONAPISerializer('Sizes', serializer).serialize(size);
  },

  deserialize(sizeData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(sizeData, (err, deserializedSize) => {
      deserializedSize._id = deserializedSize.id;
      delete deserializedSize.id;

      callback(err, deserializedSize);
    });
  },

  sizeForStock(stockData, callback) {
    if (stockData.size) {
      return callback(null, stockData.size);
    }

    if (stockData['size-name']) {
      return Size.findOrCreate({name: stockData['size-name']}, callback);
    }

    callback('Size not found');
  }
};

module.exports = SizeHelper;
