const StockView = {
  by_model: {
    map: function(doc) {
      if (doc.name) {
        emit(doc.name, {_id: doc._id});
      }
    }
  }
};

module.exports = StockView;
