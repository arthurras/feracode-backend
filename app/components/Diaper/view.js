const DiaperView = {
  by_name: {
    map: function(doc) {
      if (doc.model) {
        emit(doc.model, {_id: doc._id});
      }
    }
  }
};

module.exports = DiaperView;
