const router = require('express').Router();
const cartController = require('./controller.js');
const { police_check } = require('../../middleware/index.js')

router.get('/carts', police_check('read', 'Cart'), cartController.index);
router.put('/carts', police_check('update', 'Cart'), cartController.update);

module.exports = router;