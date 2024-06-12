const express = require('express');
const router = express.Router();

const {
	uploadQuestionnaireFilesUpdate,
	uploadQuestionOptionFilesUpdate,
	createScheduleQuestionnaireUpdate,
	//
	onCreatedQuestionnaire,
	onCreatedQuestionnaireMessage,
	onUpdatedQuestionnaireStatus,
} = require("./api.js");

router.put('/uploadQuestionnaireFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadQuestionnaireFilesUpdate(req.body);
	res.json();
});

router.put('/uploadQuestionOptionFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadQuestionOptionFilesUpdate(req.body);
	res.json();
});

router.put('/createScheduleQuestionnaireUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	// const data = await createScheduleQuestionnaireUpdate(req.body);
	res.json();
});

router.put('/onCreatedQuestionnaire', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onCreatedQuestionnaire(req.body);
	res.json();
});

router.post('/onCreatedQuestionnaireMessage', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onCreatedQuestionnaireMessage(req.body);
	res.json();
});

router.put('/onUpdatedQuestionnaireStatus', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onUpdatedQuestionnaireStatus(req.body);
	res.json();
});

module.exports = router;