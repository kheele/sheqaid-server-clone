const express = require('express');
const router = express.Router();

const {
    onLoginBiometric,
    onSetupBiometric,
} = require('./api.js');

/**
 * Handles biometric login by verifying the user's face data.
 *
 * @route POST /onLoginBiometric/:access_type
 * @param {string} access_type - The type of access, which determines user permissions.
 * @param {Object} req.body - The request body containing user information and face match details.
 * @param {string} req.body.username - The email of the user.
 * @param {Object} req.body.match - The face descriptor data used for matching.
 * @param {Object} req.body.displaySize - The size to which the detected face should be resized.
 * @returns {Object} - The response object containing the result of the biometric login.
 */
router.post('/onLoginBiometric/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await onLoginBiometric(req.body, access_type);
        res.json(data);
    } else {

    }
});

/**
 * Sets up biometric authentication for a user by saving their face image.
 *
 * @route POST /onSetupBiometric/:access_type
 * @param {string} access_type - The type of access, which determines user permissions.
 * @param {Object} req.body - The request body containing user information and face image data.
 * @param {string} req.body.uid - The unique identifier of the user.
 * @param {string} req.body.imgSrc - The base64 encoded image source of the user's face.
 * @returns {Object} - The response object containing the result of the biometric setup.
 */
router.post('/onSetupBiometric/:access_type', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await onSetupBiometric(req.body, access_type);
        res.json(data);
    } else {

    }
});

module.exports = router;

