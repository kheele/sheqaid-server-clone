const express = require('express');
const router = express.Router();

const {
	uploadHazchemDocsUpdate,
	uploadHazchemPrecautionPhotosUpdate,
} = require("./api.js");

router.put('/uploadHazchemDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadHazchemDocsUpdate(req.body);
	res.json(data);
});

router.put('/uploadHazchemPrecautionPhotosUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadHazchemPrecautionPhotosUpdate(req.body);
	res.json(data);
});

module.exports = router;