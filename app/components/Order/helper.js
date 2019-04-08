const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const serializer = require('./serializer').serializer;
const deserializer = require('./serializer').deserializer;

const OrderHelper = {
  serializeMany(orders) {
    let docs = orders.map((order) => {
      return order.doc;
    });

    return new JSONAPISerializer('Orders', serializer).serialize(docs);
  },

  serialize(order) {
    return new JSONAPISerializer('Orders', serializer).serialize(OrderHelper._prepareToSerialize(order));
  },

  _prepareToSerialize(order) {
    if (order.stock) {
      order.stock = { type: 'stocks', id: order.stock };
    }

    if (order.diaper) {
      order.diaper = { type: 'diapers', id: order.diaper };
    }

    return order;
  },

  deserialize(orderData, callback) {
    return new JSONAPIDeserializer(deserializer).deserialize(OrderHelper._prepareToDeserialize(orderData), (err, deserializedOrder) => {
      deserializedOrder._id = deserializedOrder.id;
      delete deserializedOrder.id;

      callback(err, deserializedOrder);
    });
  },

  _prepareToDeserialize(orderData) {
    if (orderData.data.diaper) {
      orderData.data.relationships.diaper = orderData.data.diaper;
    }

    if (orderData.data.size) {
      orderData.data.relationships.size = orderData.data.size;
    }

    return orderData;
  },

  normalizeData(orderData) {
    delete orderData['size-name'];

    return orderData;
  }
};

module.exports = OrderHelper;
