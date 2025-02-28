const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/documents', require('./documents'))

module.exports = router;