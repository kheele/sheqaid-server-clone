const express = require('express');
const router = express.Router();

/**
 * Logs out the user by clearing the session cookie.
 *
 * @function
 * @param {Object} req - The Express request object containing the access type as a URL parameter and session details in cookies.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the sign-out operation is completed, clearing the session cookie if successful.
 */
router.post('/out/:access_type', async (req, res) => {
	const {access_type} = req.params;
	signOut({
		session: req.session,
		sessionCookie: req.cookies.session || '',
		access_type,
	})
	.then((res) => {
		if(res) {
			res.clearCookie('session');
			res.json(res);
		} else {
			res.end();
		}
	})
	.catch((err) => {
		// res.clearCookie('session');
		res.end();
	});
});

/**
 * Re-authenticates the user based on the provided access type and user ID.
 *
 * @function
 * @param {Object} req - The Express request object containing the access type as a URL parameter and user ID in the body.
 * @param {Object} res - The Express response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves with the re-authentication result, or ends the response if the data is not available.
 */
router.post('/onReAuthUser/:access_type', async (req, res) => {
	const {access_type} = req.params;
	onReAuthUser({
		access_type,
		uid: req.body,
	}).then(data => {
		if(!data) {
			return res.end();
		}
		if(data instanceof String || typeof data === 'string') {
			return res.end(data);
		}
		res.json(data);
	});
});

module.exports = router;

