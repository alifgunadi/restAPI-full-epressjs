const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const tagController = require('./controller');
const { police_check } = require('../../middleware');

router.get('/tag', tagController.index);
router.get('/tag/:id', tagController.getId);
router.post('/tag', multer({dest: os.tmpdir}).single('image'), 
    police_check('create', 'Tag'),
    tagController.store
);
router.put('/tag/:id', multer({dest: os.tmpdir}).single('image'), 
    police_check('update', 'Tag'),
    tagController.update
);
router.delete('/tag/:id', 
    police_check('delete', 'Tag'),
    tagController.remove
);

module.exports = router;