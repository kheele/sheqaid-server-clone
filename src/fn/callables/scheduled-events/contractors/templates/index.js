const express = require('express');
const router = express.Router();

const {onContractorTemplatesExpiry} = require("./api.js");

router.post('/onContractorTemplatesExpiry', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await onContractorTemplatesExpiry(req.body);
    res.json(data);
});

module.exports = router;

