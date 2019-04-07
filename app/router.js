const express = require('express');
const router = express.Router();

const DiaperController = require('./components/Diaper/controller');
const SizeController = require('./components/Size/controller');
const StockController = require('./components/Stock/controller');
const OrderController = require('./components/Order/controller');

router.route('/diapers')
  .get(DiaperController.list)
  .post(DiaperController.create)
;

router.route('/diapers/:diaper_id')
  .get(DiaperController.one)
  .patch(DiaperController.update)
;

router.route('/diapers')
  .get(OrderController.list)
  .post(OrderController.create)
;

router.route('/sizes')
  .get(SizeController.list)
  .post(SizeController.create)
;

router.route('/sizes/:size_id')
  .get(SizeController.one)
  .patch(SizeController.update)
;

router.route('/stocks')
  .get(StockController.list)
  .post(StockController.create)
;

router.route('/stocks/:stock_id')
  .get(StockController.one)
  .patch(StockController.update)
;

module.exports = router;
