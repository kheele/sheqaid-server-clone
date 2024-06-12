const express = require('express');
const router = express.Router();

const {
    sendWelcomeEmail,
    sendWelcomeOTP,
    sendNewContractorSiteEmail,
    sendUpdateStatusContractorSiteEmail,
    onResetPassword,
} = accountsApi;

const CustomUserClaims = require('./CustomUserClaims.js');
const sign = require('./sign.js');

router.use("/onSetCustomUserClaims", CustomUserClaims);

router.use("/sign", sign);

router.post('/sendWelcomeEmail', async (req, res) => {
    await sendWelcomeEmail(req.body);
    res.end();
});

router.post('/sendWelcomeOTP', async (req, res) => {
    await sendWelcomeOTP(req.body);
    res.end();
});

router.post('/sendNewContractorSiteEmail', async (req, res) => {
    await sendNewContractorSiteEmail(req.body);
    res.end();
});
//safety2: consultants
//
router.post('/sendUpdateStatusContractorSiteEmail', async (req, res) => {
    await sendUpdateStatusContractorSiteEmail(req.body);
    res.end();
});

router.post('/onResetPassword/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        await onResetPassword(req.body, access_type);
        res.json(true);
    } else {
        res.json(false);
    }
});


module.exports = router;
