const Diaper = require('./model');
const DiaperHelper = require('./helper');
const DBErrors = require('../../helpers/DBErrors');

const DiaperController = {

  list(req, res) {
    return DiaperHelper.queryWithStock(req.query, (err, result) => {
      return res.json(DiaperHelper.serializeMany(result));
    });
  },

  one(req, res) {
    return DiaperHelper.findByIdWithStock(req.params.diaper_id, (err, foundedDiaper) => {
      if (err) {
        return res.json(err);
      }

      return res.json(DiaperHelper.serialize(foundedDiaper));
    });
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
  },

  delete(req, res) {
    return Diaper.updateDiff({_id: req.params.diaper_id, deletedAt: new Date()}, (err, savedDiaper) => {
      return res.json(DiaperHelper.serialize({_id: savedDiaper._id}));
    });
  }
};

module.exports = DiaperController;
