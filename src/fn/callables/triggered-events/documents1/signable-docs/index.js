const express = require('express');
const router = express.Router();

const {
	sendSignableDocSubmitterLinkByEmail,
	onSignableDocSubmissionEvent,
} = require("./api.js");

router.post('/sendSignableDocSubmitterLinkByEmail', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await sendSignableDocSubmitterLinkByEmail(req.body);
	res.end();
});

router.post('/onSignableDocSubmissionEvent', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onSignableDocSubmissionEvent(req.body);
	res.end();
});

module.exports = router;
