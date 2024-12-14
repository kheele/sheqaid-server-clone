const express = require('express');
const router = express.Router();

const ohs_docs = require("./ohs-docs");
const signable_docs = require("./signable-docs");

const {
	uploadDocUpdate,
} = require("./api.js");

router.put('/uploadDocumentVersionUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadDocUpdate(req.body);
	res.json();
});

router.use('/ohs-docs', ohs_docs);
router.use('/signable-docs', signable_docs);

module.exports = router;
