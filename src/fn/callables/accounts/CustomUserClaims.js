const express = require('express');
const router = express.Router();

/**
 * Handles the POST request for setting custom user claims for a "User" access type.
 * Retrieves `idToken` and `csrfToken` from the request body, and uses them to set custom user claims.
 * Sets a session cookie if custom claims are successfully set, and responds with the resulting data.
 *
 * @param {Object} req - The Express request object containing `idToken`, `csrfToken`, and session.
 * @param {Object} res - The Express response object used to set the session cookie and send the response.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
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

/**
 * Handles the POST request for setting custom user claims for a "ContractorUser" access type.
 * Retrieves `idToken` and `csrfToken` from the request body, and uses them to set custom user claims.
 * Sets a session cookie if custom claims are successfully set, and responds with the resulting data.
 *
 * @param {Object} req - The Express request object containing `idToken`, `csrfToken`, and session.
 * @param {Object} res - The Express response object used to set the session cookie and send the response.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
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

/**
 * Handles the POST request for setting custom user claims for a "Staff" access type.
 * Retrieves `idToken` and `csrfToken` from the request body, and uses them to set custom user claims.
 * Sets a session cookie if custom claims are successfully set, and responds with the resulting data.
 *
 * @param {Object} req - The Express request object containing `idToken`, `csrfToken`, and session.
 * @param {Object} res - The Express response object used to set the session cookie and send the response.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
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

