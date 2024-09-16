const express = require('express');
const router = express.Router();

const {onEmployeesProfileIncomplete} = require("./api.js");

router.post('/onEmployeesProfileIncomplete', async (req, res) => {
    console.log(req.path, req.body)
    const data = await onEmployeesProfileIncomplete(req.body);
    res.end();
});

module.exports = router;

