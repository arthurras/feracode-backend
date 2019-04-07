const StockView = {
  stock_by_diaper: {
    map: function(doc) {
      if (doc.diaper) {
        emit(doc.diaper, {_id: doc._id});
      }
    }
  },
  stock_by_diaper_size: {
    map: function(doc) {
      if (doc.diaper && doc.size) {
        emit([doc.diaper, doc.size], {_id: doc._id});
      }
    }
  },
};

module.exports = StockView;
