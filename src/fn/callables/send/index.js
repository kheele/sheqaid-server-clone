const express = require('express');
const router = express.Router();

router.post('/sendUserOTP/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await sendUserOTP(req.body, access_type);
        res.json(data);
    } else {

    }
});

router.post('/confirmUserOTP/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await confirmUserOTP(req.body, access_type);
        res.json(data);
    } else {

    }
});

router.post('/sendForgotPass/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await sendForgotPass(req.body, access_type);
        res.json(data);
    } else {

    }
});

module.exports = router;

