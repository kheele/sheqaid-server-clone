const express = require('express');
const router = express.Router();

const {
	uploadPPEItemProfilePicUpdate,
} = require("./api.js");

router.put('/uploadPPEItemProfilePicUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadPPEItemProfilePicUpdate(req.body);
	res.json();
});

module.exports = router;
