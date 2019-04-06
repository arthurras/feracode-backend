const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const serializer = require('./serializer').serializer;
const deserializer = require('./serializer').deserializer;

const DiaperHelper = {
  serializeMany(diapers) {
    let docs = diapers.map((diaper) => {
      return diaper.doc;
    });

    return new JSONAPISerializer('Diapers', serializer).serialize(docs);
  },

  serialize(diaper) {
    return new JSONAPISerializer('Diapers', serializer).serialize(diaper);
  },

  deserialize(diaperData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(diaperData, (err, deserializedDiaper) => {
      deserializedDiaper._id = deserializedDiaper.id;
      delete deserializedDiaper.id;

      callback(err, deserializedDiaper);
    });
  }
};

module.exports = DiaperHelper;
