const express = require('express');
const router = express.Router();

const {onIncidentInvestigationExpiry} = require("./api.js");

router.post('/onIncidentInvestigationExpiry', async (req, res) => {
    console.log(req.path, req.body)
    const data = await onIncidentInvestigationExpiry(req.body);
    res.end();
});

module.exports = router;

