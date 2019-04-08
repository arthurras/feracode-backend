const DiaperView = {
  diaper_by_model: {
    map: function(doc) {
      if (doc.model && !doc.deletedAt) {
        emit(doc.model, {_id: doc._id});
      }
    }
  }
};

module.exports = DiaperView;
