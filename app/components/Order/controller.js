const DBErrors = require('../../helpers/DBErrors');
const Order = require('./model');
const OrderHelper = require('./helper');
const SizeHelper = require('../Size/helper');
const StockHelper = require('../Stock/helper');

const OrderController = {

  list(req, res) {
    let viewParams = {
      include_docs: true,
      descending: true
    };

    return Order.view(
      'by_name', 'by_name',
      viewParams, DBErrors.wrapNano(function(err, result) {
        if (err) {
          return res.json(err);
        }

        return res.json(OrderHelper.serializeMany(result.rows));
      })
    );
  },

  one(req, res) {
    Order.findById(req.params.order_id, (err, foundedOrder) => {
      if (err) {
        return res.json(err);
      }

      return res.json(OrderHelper.serialize(foundedOrder));
    });
  },

  create(req, res) {
    return OrderHelper.deserialize(req.body, (err, orderData) => {
      if (err) {
        return console.log(err);
      }

      orderData.createdAt = new Date();

      return StockHelper.decreaseStock(orderData, (err, stock) => {
        if (err) {
          return res.status(500).json(err);
        }

        return Order.create(orderData, (err, savedOrder) => {
          res.json(OrderHelper.serialize(savedOrder));
        });
      });
    });
  },

  update(req, res) {
    return OrderHelper.deserialize(req.body, (err, orderData) => {
      return Order.updateDiff(orderData, (err, savedOrder) => {
        res.json(OrderHelper.serialize(savedOrder));
      });
    });
  }
};

module.exports = OrderController;
