const express = require('express');
const router = express.Router();

const {
	uploadSDSDocsUpdate,
} = require("./api.js");

router.put('/uploadSDSDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadSDSDocsUpdate(req.body);
	res.json(data);
});

module.exports = router;