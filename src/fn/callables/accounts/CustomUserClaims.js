const express = require('express');
const router = express.Router();

router.post('/User', async (req, res) => {
    const access_type = "User";

    const {idToken, csrfToken} = req.body;
    const {session} = req;

    const data = await onSetCustomUserClaims({
        session, data: {idToken, csrfToken}, access_type,
    });
    if(data) {
        const {sessionCookie, options} = data;
        res.cookie('session', sessionCookie, options);
    }
    res.json(data);
});

router.post('/ContractorUser', async (req, res) => {
    const access_type = "ContractorUser";

    const {idToken, csrfToken} = req.body;
    const {session} = req;

    const data = await onSetCustomUserClaims({
        session, data: {idToken, csrfToken}, access_type,
    });
    if(data) {
        const {sessionCookie, options} = data;
        res.cookie('session', sessionCookie, options);
    }
    res.json(data);
});

router.post('/Staff', async (req, res) => {
    const access_type = "Staff";

    const {idToken, csrfToken} = req.body;
    const {session} = req;

    const data = await onSetCustomUserClaims({
        session, data: {idToken, csrfToken}, access_type,
    });
    if(data) {
        const {sessionCookie, options} = data;
        res.cookie('session', sessionCookie, options);
    }
    res.json(data);
});

module.exports = router;

