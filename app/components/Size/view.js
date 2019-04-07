const SizeView = {
  by_name: {
    map: function(doc) {
      if (doc.name) {
        emit(doc.name, {_id: doc._id});
      }
    }
  }
};

module.exports = SizeView;
