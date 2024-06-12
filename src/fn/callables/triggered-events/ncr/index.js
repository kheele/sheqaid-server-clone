const express = require('express');
const router = express.Router();

const automate = require('./automate');

const {
	uploadNCRDocsUpdate,
} = require("./api.js");

router.put('/uploadNCRDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadNCRDocsUpdate(req.body);
	res.json(data);
});

// automate.run();

module.exports = router;