let options = {
  serializer: {
    id: '_id',
    attributes: ['createdAt', 'stock', 'diaper'],
    diaper: {
      ref: 'id',
      included: false,
      attributes: ['id']
    },
    stock: {
      ref: 'id',
      included: false,
      attributes: ['id']
    }
  },
  deserializer: {
    attributes: ['order'],
    relationships: ['diaper', 'stock'],
    diapers: {
      valueForRelationship(relationship) {
        return relationship.id;
      }
    },
    stocks: {
      valueForRelationship(relationship) {
        return relationship.id;
      }
    }
  }
};

module.exports = options;
