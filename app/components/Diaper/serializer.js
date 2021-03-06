let options = {
  serializer: {
    id: '_id',
    attributes: ['model', 'description', 'stock'],
    stock: {
      ref: 'id',
      included: false,
      attributes: ['id']
    }
  },
  deserializer: {
    attributes: ['model', 'description'],
    relationships: ['sizes'],
    sizes: {
      valueForRelationship: function (relationship) {
        return relationship.id;
      }
    }
  }
};

module.exports = options;
