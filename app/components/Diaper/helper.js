const async = require('async');
const DBErrors = require('../../helpers/DBErrors');
const deserializer = require('./serializer').deserializer;
const Diaper = require('./model');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const serializer = require('./serializer').serializer;
const Stock = require('../Stock/model');

const { promisify } = require('util');

const DiaperHelper = {
  serializeMany(diapers) {
    let docs = diapers.map((diaper) => {
      if (diaper.doc) {
        diaper = diaper.doc;
      }

      return DiaperHelper._prepareToSerialize(diaper);
    });

    return new JSONAPISerializer('Diapers', serializer).serialize(docs);
  },

  serialize(diaper) {
    return new JSONAPISerializer('Diapers', serializer).serialize(DiaperHelper._prepareToSerialize(diaper));
  },

  _prepareToSerialize(diaper) {
    if (diaper.stock && diaper.stock.length) {
      diaper.stock = diaper.stock.map((stock) => {
        return { type: 'stocks', id: stock };
      });
    }

    return diaper;
  },

  deserialize(diaperData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(diaperData, (err, deserializedDiaper) => {
      deserializedDiaper._id = deserializedDiaper.id;
      delete deserializedDiaper.id;

      callback(err, deserializedDiaper);
    });
  },

  queryWithStock(rawQuery, callback) {
    let viewParams = {
      include_docs: true,
      descending: true
    };

    return Diaper.view(
      'diaper_by_model', 'diaper_by_model',
      viewParams, DBErrors.wrapNano(function(err, result) {
        if (err) {
          return callback(err);
        }

        async.map(result.rows, async diaper => {
          const stock = await DiaperHelper.fetchStock(diaper);
          diaper = diaper.doc;

          if (stock && stock.length) {
            diaper.stock = stock.map((item) => {
              return item.id
            });
          }

          return diaper;
        }, (err, diapers) => {
          callback(err, diapers);
        });
      })
    );
  },

  findByIdWithStock(diaperId, callback) {
    return Diaper.findById(diaperId, DBErrors.wrapNano(async (err, diaper) => {
      if (err) {
        return callback(err);
      }

      if (diaper.deletedAt) {
        callback(err, null);
      }

      const stock = await DiaperHelper.fetchStock(diaper);

      if (stock && stock.length) {
        diaper.stock = stock.map((item) => {
          return item.id
        });
      }

      callback(err, diaper);
    }));
  },

  fetchStock(diaper, callback) {
    let viewParams = {
      key: diaper.id || diaper._id,
      include_docs: true
    };

    return promisify(Stock.view)(
      'stock_by_diaper', 'stock_by_diaper',
      viewParams
    ).then((result) => {
      return result.rows;
    });
  }
};

module.exports = DiaperHelper;
