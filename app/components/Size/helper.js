const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const serializer = require('./serializer').serializer;
const deserializer = require('./serializer').deserializer;

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
  }
};

module.exports = SizeHelper;
