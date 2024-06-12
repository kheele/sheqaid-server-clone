const express = require('express');
const router = express.Router();

const {onQuestionnairesExpiry} = require("./api.js");

router.post('/onQuestionnairesExpiry', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await onQuestionnairesExpiry(req.body);
    res.json(data);
});

module.exports = router;

