
const express = require('express');
const router = express.Router();

const profile = require("./profile");
const documents = require("./documents");

router.use('/profile', profile);
router.use('/documents', documents);

module.exports = router;

