const config = require('config');
const DBErrors = require('../../helpers/DBErrors');
const schemas = require('../../database/Schemas');
const Orders = require('../../database/couchdb').use('orders');
const diff = require('object-versions').diff;
const extend = require('extend');

const OrderModel = {

  create(order, callback) {
    return schemas.validating('Order', OrderModel.save(order, (err, savedOrder) => {
      return OrderModel.findById(savedOrder.id, callback);
    }));
  },

  update(order, callback) {
    return Orders.get(order._id, DBErrors.wrapNano((err, currentOrder) => {
      if (err) {
        return callback(err);
      }

      let orderDiff = diff(currentOrder, order);

      return schemas.validate(orderDiff, 'Order', 'update', (err) => {
        if (err) {
          return callback(err);
        }

        return Orders.insert(order, (err, savedOrder) => {
          return OrderModel.findById(savedOrder.id, DBErrors.wrapNano(callback));
        });
      });
    }));
  },

  updateDiff(orderDiff, callback) {
    schemas.validate(orderDiff, 'Order', 'update', function(err) {
      if (err) {
        return callback(err);
      }

      return OrderModel.merge(orderDiff, callback);
    });
  },

  list(queryParams, callback) {
    return Orders.fetch(queryParams, callback);
  },

  view(view, viewName, query, callback) {
    return Orders.view(view,  viewName, query, callback);
  },

  save(order, callback) {
    return Orders.insert(order, DBErrors.wrapNano(callback));
  },

  findById(id, callback) {
    return Orders.get(id, callback);
  },

  merge(orderDiff, callback) {
    return Orders.get(orderDiff._id, DBErrors.wrapNano(function(err, order) {
      if (err) {
        return callback(err);
      }

      extend(order, orderDiff);

      schemas.validate(order, 'Order', 'update', function(err) {
        if (err) {
          return callback(err);
        }

        return Orders.insert(order, DBErrors.wrapNano((err) => {
          return OrderModel.done(err, orderDiff, (err, savedOrder) => {
            return OrderModel.findById(savedOrder._id, DBErrors.wrapNano(callback));
          });
        }));
      });
    }));
  },

  done(err, orderDiff, callback) {
    if (err && err.statusCode == 409 && !orderDiff._rev) {
      OrderModel.merge(orderDiff, callback); // try again
    }

    return callback(...arguments);
  }

};

module.exports = OrderModel;
