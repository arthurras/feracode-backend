let options = {
  serializer: {
    id: '_id',
    attributes: ['stock', 'size', 'diaper'],
    diaper: {
      ref: 'id',
      included: false,
      attributes: ['id']
    },
    size: {
      ref: 'id',
      included: false,
      attributes: ['id']
    }
  },
  deserializer: {
    attributes: ['stock'],
    relationships: ['diaper', 'size'],
    diapers: {
      valueForRelationship(relationship) {
        return relationship.id;
      }
    },
    sizes: {
      valueForRelationship(relationship) {
        return relationship.id;
      }
    }
  }
};

module.exports = options;
