const OrderView = {
  order_by_diaper: {
    map: function(doc) {
      if (doc.diaper) {
        emit(doc.diaper, {_id: doc._id});
      }
    }
  },
  order_by_stock: {
    map: function(doc) {
      if (doc.stock) {
        emit(doc.stock, {_id: doc._id, createdAt: doc.createdAt});
      }
    }
  },
  orders_number_for_stock: {
    map: function(doc) {
      if (doc.stock) {
        emit(doc.stock, 1);
      }
    },
    reduce: function(keys, values) {
      return sum(values);
    }
  },

  orders_times_for_stock: {
    map: function(doc) {
      if (doc.stock) {
        emit(doc.stock, doc.createdAt);
      }
    },
    reduce: function(keys, values) {
      return values;
    }
  }
};

module.exports = OrderView;
