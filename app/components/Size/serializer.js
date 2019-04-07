let options = {
  serializer: {
    id: '_id',
    attributes: ['name']
  },
  deserializer: {
    attributes: ['name']
  }
};

module.exports = options;
