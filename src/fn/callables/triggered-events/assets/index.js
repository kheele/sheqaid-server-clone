const express = require('express');
const router = express.Router();

const {
	uploadAssetPhotoFilesUpdate,
	uploadAssetDocFilesUpdate,
	uploadAssetPurchaseInfoFilesUpdate,
	uploadAssetMonitoringPlanFuelUsageFilesUpdate,
} = require("./api.js");

router.put('/uploadAssetPhotoFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetPhotoFilesUpdate(req.body);
	res.json();
});
//x-hasura-user-id: {{$session_variables['x-hasura-user-id']}}
router.put('/uploadAssetDocFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetDocFilesUpdate(req.body);
	res.json();

	// // const session = req.session;
	// const userId = req.get('x-hasura-user-id');
	// // const userId = session['x-hasura-user-id'];
	// console.log('userId', userId);
	//
	// io.to(userId).emit("insertAssetDoc");
});

router.put('/uploadAssetPurchaseInfoFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetPurchaseInfoFilesUpdate(req.body);
	res.json();
});

router.put('/uploadAssetMonitoringPlanFuelUsageFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetMonitoringPlanFuelUsageFilesUpdate(req.body);
	res.json();
});

module.exports = router;