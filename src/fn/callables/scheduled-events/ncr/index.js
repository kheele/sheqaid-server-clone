const express = require('express');
const router = express.Router();

const {onNCRExpiry} = require("./api.js");

router.post('/onNCRExpiry', async (req, res) => {
    console.log(req.path, req.body)
    const data = await onNCRExpiry(req.body);
    res.end();
});

module.exports = router;

