const Diaper = require('./model');
const DiaperHelper = require('./helper');
const DBErrors = require('../../helpers/DBErrors');

const DiaperController = {

  list(req, res) {
    Diaper.list({}, (err, result) => {
      if (err) {
        return res.json(err);
      }

      return res.json(DiaperHelper.serializeMany(result.rows));
    });

    // let viewParams = {
    //   include_docs: true,
    //   descending: true
    // };
    //
    // return Diaper.view(
    //
    //   viewParams, DBErrors.wrapNano(function(err, result) {
    //     if (err) {
    //       return res.json(err);
    //     }
    //
    //     return res.json(DiaperHelper.serializeMany(result.rows));
    //   })
    // );
  },

  create(req, res) {
    return DiaperHelper.deserialize(req.body, (err, diaperData) => {
      if (err) {
        return console.log(err);
      }

      diaperData.createdAt = new Date();

      return Diaper.create(diaperData, (err, savedDiaper) => {
        res.json(DiaperHelper.serialize(savedDiaper));
      });
    });
  },

  update(req, res) {
    return DiaperHelper.deserialize(req.body, (err, diaperData) => {
      return Diaper.updateDiff(diaperData, (err, savedDiaper) => {
        res.json(DiaperHelper.serialize(savedDiaper));
      });
    });
  }

};

module.exports = DiaperController;
