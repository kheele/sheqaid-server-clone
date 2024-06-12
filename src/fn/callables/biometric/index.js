const express = require('express');
const router = express.Router();

const {
    onLoginBiometric,
    onSetupBiometric,
} = require('./api.js');

router.post('/onLoginBiometric/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await onLoginBiometric(req.body, access_type);
        res.json(data);
    } else {

    }
});

router.post('/onSetupBiometric/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await onSetupBiometric(req.body, access_type);
        res.json(data);
    } else {

    }
});

module.exports = router;

