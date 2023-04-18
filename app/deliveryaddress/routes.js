const router = require('express').Router();
const deliveryAddressController = require('./controller.js');
const { police_check } = require('../../middleware/index');

router.get('/delivery-addresses', deliveryAddressController.index);
router.get('/delivery-addresses/:id', deliveryAddressController.getUserId);
router.put('/delivery-addresses/:id', police_check('update', 'DeliveryAddress'), deliveryAddressController.update);
router.post('/delivery-addresses', police_check('create', 'DeliveryAddress'), deliveryAddressController.store);
router.delete('/delivery-addresses/:id', police_check('delete', 'DeliveryAddress'), deliveryAddressController.remove);

module.exports = router;