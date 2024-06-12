const express = require('express');
const router = express.Router();

const {onIncidentExpiry} = require("./api.js");

router.post('/onIncidentExpiry', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await onIncidentExpiry(req.body);
    res.json(data);
});

module.exports = router;

