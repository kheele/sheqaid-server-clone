const express = require('express');
const router = express.Router();

const assets = require("./assets");
const chemicals = require("./chemicals");
const coid_claims = require("./coid-claims");
const documents = require("./documents");
const incidents = require("./incidents");
const ncr = require("./ncr");
const ppeItems = require("./ppe-items");
const ppeTypes = require("./ppe-types");
const questionnaires = require("./questionnaires");

router.use('/assets', assets);
router.use('/chemicals', chemicals);
router.use('/coid-claims', coid_claims);
router.use('/documents/versions', documents);
router.use('/incidents', incidents);
router.use('/ncr', ncr);
router.use('/ppe-items', ppeItems);
router.use('/ppe-types', ppeTypes);
router.use('/questionnaires', questionnaires);

module.exports = router;
