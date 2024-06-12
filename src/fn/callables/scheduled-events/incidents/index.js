const express = require('express');
const router = express.Router();

const corrective_actions = require("./corrective-actions");
const investigations = require("./investigations");
const incidents = require("./incidents");

router.use('/corrective-actions', corrective_actions);
router.use('/investigations', investigations);
router.use('/incidents', incidents);

module.exports = router;