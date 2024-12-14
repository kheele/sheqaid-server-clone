const express = require('express');
const router = express.Router();

const {
	uploadOHSDocsUpdate,
} = require("./api.js");

router.put('/uploadOHSDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadOHSDocsUpdate(req.body);
	res.json();
});

module.exports = router;
