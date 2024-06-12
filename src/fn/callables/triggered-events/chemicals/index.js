const express = require('express');
const router = express.Router();

const hazchem = require("./hazchem");
const product = require("./product");
const sds = require("./sds");

router.use('/hazchem', hazchem);
router.use('/product', product);
router.use('/sds', sds);

module.exports = router;