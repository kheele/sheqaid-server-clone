const express = require('express');
const router = express.Router();

const {
	uploadPPETypeProfilePicUpdate,
} = require("./api.js");

router.put('/uploadPPETypeProfilePicUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadPPETypeProfilePicUpdate(req.body);
	res.json();
});

module.exports = router;
