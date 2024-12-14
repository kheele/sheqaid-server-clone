const express = require('express');
const router = express.Router();

const {onDocumentsExpiry} = require("./api.js");

router.post('/onDocumentsExpiry', async (req, res) => {
    console.log(req.path, req.body)
    // const data = await onDocumentsExpiry(req.body);
    res.end();
});

module.exports = router;

