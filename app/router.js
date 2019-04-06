const express = require('express');
const router = express.Router();

const DiaperController = require('./components/Diaper/controller');
const SizeController = require('./components/Size/controller');
const StockController = require('./components/Stock/controller');

router.route('/diapers')
  .get(DiaperController.list)
;

router.route('/diapers')
  .post(DiaperController.create)
;

router.route('/diapers/:diaper_id')
  .patch(DiaperController.update)
;

router.route('/stocks')
  .get(StockController.list)
;

router.route('/stocks')
  .post(StockController.create)
;

router.route('/stocks/:diaper_id')
  .patch(StockController.update)
;

module.exports = router;
