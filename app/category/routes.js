const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const categoriesController = require('./controller');

router.get('/category', categoriesController.index);
router.get('/category/:id', categoriesController.getId);
router.post('/category', multer({dest: os.tmpdir()}).single('image'), categoriesController.store);
router.put('/category/:id', multer({dest: os.tmpdir()}).single('image'), categoriesController.update);
router.delete('/category/:id', categoriesController.remove);

module.exports = router;