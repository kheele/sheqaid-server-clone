const express = require('express');
const router = express.Router();

const {
	uploadProductDocsUpdate,
} = require("./api.js");

router.put('/uploadProductDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadProductDocsUpdate(req.body);
	res.json(data);
});

module.exports = router;