const express = require('express');
const router = express.Router();

const {
	sendNewQuickIncidentNotification,
} = require("./api.js");

router.post('/sendNewQuickIncidentNotification', async (req, res) => {
	// console.log(req.path, req.body)
	try {
		const auth_id = await sendNewQuickIncidentNotification(req.body);
		if (auth_id) {
			io.to(auth_id).emit('sendNewQuickIncidentNotification');
		}
	} catch (err) {

	}

	res.json();
});

module.exports = router;