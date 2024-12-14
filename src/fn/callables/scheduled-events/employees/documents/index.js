const express = require('express');
const router = express.Router();

const {onEmployeeDocsExpiry} = require("./api.js");

router.post('/onEmployeeDocsExpiry', async (req, res) => {
    console.log(req.path, req.body)
    const data = await onEmployeeDocsExpiry(req.body);
    res.end();
});

// onEmployeeDocsExpiry({});

module.exports = router;

