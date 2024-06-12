const express = require('express');
const router = express.Router();

const questionnaires = require("./questionnaires");
const templates = require("./templates");

router.use('/questionnaires', questionnaires);
router.use('/templates', templates);

module.exports = router;