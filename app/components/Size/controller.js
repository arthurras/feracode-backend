const Size = require('./model');
const SizeHelper = require('./helper');
const DBErrors = require('../../helpers/DBErrors');

const SizeController = {

  list(req, res) {
    let viewParams = {
      include_docs: true,
      descending: true
    };


    if (req.query.name) {
      viewParams.key = req.query.name;
    }

    return Size.view(
      'by_name', 'by_name',
      viewParams, DBErrors.wrapNano(function(err, result) {
        if (err) {
          return res.json(err);
        }

        return res.json(SizeHelper.serializeMany(result.rows));
      })
    );
  },

  one(req, res) {
    Size.findById(req.params.size_id, (err, foundedSize) => {
      if (err) {
        return res.json(err);
      }

      return res.json(SizeHelper.serialize(foundedSize));
    });
  },


  create(req, res) {
    return SizeHelper.deserialize(req.body, (err, sizeData) => {
      if (err) {
        return console.log(err);
      }

      sizeData.createdAt = new Date();

      return Size.create(sizeData, (err, savedSize) => {
        res.json(SizeHelper.serialize(savedSize));
      });
    });
  },

  update(req, res) {
    return SizeHelper.deserialize(req.body, (err, sizeData) => {
      return Size.updateDiff(sizeData, (err, savedSize) => {
        res.json(SizeHelper.serialize(savedSize));
      });
    });
  }

};

module.exports = SizeController;
