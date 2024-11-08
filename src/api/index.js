const express = require('express');
const router = express.Router();

require('./accounts');
require('./get');
require('./send');

const callables = require('../fn/callables');
const update = require('./update');

router.use('/callables', callables);
router.use('/update', update);

module.exports = router;