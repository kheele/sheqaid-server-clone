const express = require('express');
const router = express.Router();

const {onTrainingPlanExpiry} = require("./api.js");

router.post('/onTrainingPlanExpiry', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await onTrainingPlanExpiry(req.body);
    res.json(data);
});

module.exports = router;

