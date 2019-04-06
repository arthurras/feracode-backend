const Boom = require('boom');

const DBErrors = {
  wrapNano(callback) {
    return function(err) {
      if (err) {
        new Boom(err, err.statusCode || 500);
      }

      callback(...arguments);
    };
  }
};

module.exports = DBErrors;
