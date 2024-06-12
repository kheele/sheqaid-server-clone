const express = require('express');
const router = express.Router();

const assets = require("./assets");//
const contractors = require("./contractors");//
const documents = require("./documents");
const employees = require("./employees");//
const incidents = require("./incidents");//
const inspections = require("./inspections");//
const ncr = require("./ncr");//
const training = require("./training");//

router.use('/assets', assets);
router.use('/contractors', contractors);
router.use('/documents', documents);
router.use('/employees', employees);
router.use('/incidents', incidents);
router.use('/inspections', inspections);
router.use('/ncr', ncr);
router.use('/training', training);

module.exports = router;