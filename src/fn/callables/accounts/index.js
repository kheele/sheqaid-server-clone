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

/**
 * Routes requests for setting custom user claims.
 *
 * @module /onSetCustomUserClaims
 * @requires CustomUserClaims
 */
router.use("/onSetCustomUserClaims", CustomUserClaims);

/**
 * Routes requests related to sign-in and sign-out operations.
 *
 * @module /sign
 * @requires sign
 */
router.use("/sign", sign);

/**
 * Sends a welcome email to the user.
 *
 * @function
 * @param {Object} req - The Express request object containing the email details in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 */
router.post('/sendWelcomeEmail', async (req, res) => {
    await sendWelcomeEmail(req.body);
    res.end();
});

/**
 * Sends a One-Time Password (OTP) for welcome purposes.
 *
 * @function
 * @param {Object} req - The Express request object containing the OTP details in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the OTP has been sent.
 */
router.post('/sendWelcomeOTP', async (req, res) => {
    await sendWelcomeOTP(req.body);
    res.end();
});

/**
 * Sends an email about a new contractor site.
 *
 * @function
 * @param {Object} req - The Express request object containing the site details in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 */
router.post('/sendNewContractorSiteEmail', async (req, res) => {
    await sendNewContractorSiteEmail(req.body);
    res.end();
});

/**
 * Sends an email updating the status of a contractor site.
 *
 * @function
 * @param {Object} req - The Express request object containing the status details in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 */
router.post('/sendUpdateStatusContractorSiteEmail', async (req, res) => {
    await sendUpdateStatusContractorSiteEmail(req.body);
    res.end();
});

/**
 * Handles password reset requests based on access type.
 *
 * @function
 * @param {Object} req - The Express request object containing the access type as a URL parameter and password reset details in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves with `true` if the access type is valid and the password has been reset, or `false` otherwise.
 */
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
