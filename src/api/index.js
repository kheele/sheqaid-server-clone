const express = require('express');
const router = express.Router();

require('./accounts');
require('./get');
require('./send');

const callables = require('../fn/callables');

router.use('/callables', callables);

module.exports = router;