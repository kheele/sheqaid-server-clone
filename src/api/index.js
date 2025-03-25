const express = require('express');
const router = express.Router();

require('./accounts');
require('./get');
require('./send');

const callables = require('../fn/callables');
const update = require('./update');
const workflows = require('./workflows');

router.use('/callables', callables);
router.use('/update', update);
router.use('/workflows', workflows);

module.exports = router;