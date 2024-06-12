const express = require('express');
const router = express.Router();

const contentScheduler = require("./content-scheduler");

router.use('/content-scheduler', contentScheduler);

module.exports = router;
