const express = require('express');
const router = express.Router();

/**
 * @route POST /getUserUidByUsername/:access_type
 * @desc Retrieves the user UID based on the username and access type.
 * @param {string} access_type - The access type required for authorization.
 * @param {Object} req.body - The request body containing the username.
 * @param {string} req.body - The username of the user whose UID is to be retrieved.
 * @returns {Object} - A JSON object containing the user UID or an empty object.
 */
router.post('/getUserUidByUsername/:access_type', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByUsername(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

/**
 * @route POST /getUserUidByEmail/:access_type
 * @desc Retrieves the user UID based on the email and access type.
 * @param {string} access_type - The access type required for authorization.
 * @param {Object} req.body - The request body containing the email.
 * @param {string} req.body - The email of the user whose UID is to be retrieved.
 * @returns {Object} - A JSON object containing the user UID or an empty object.
 */
router.post('/getUserUidByEmail/:access_type', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByEmail(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

/**
 * @route POST /getUserUidByPhone
 * @desc Retrieves the user UID based on the phone number.
 * @param {Object} req.body - The request body containing the phone number.
 * @param {string} req.body - The phone number of the user whose UID is to be retrieved.
 * @returns {Object} - A JSON object containing the user UID or an empty object.
 */
router.post('/getUserUidByPhone', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByPhone(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

module.exports = router;

