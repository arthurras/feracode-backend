let options = {
  serializer: {
    id: '_id',
    attributes: ['stock']
  },
  deserializer: {
    attributes: ['stock']
  }
};

module.exports = options;
