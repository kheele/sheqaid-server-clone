const express = require('express');
const router = express.Router();

const automate = require('./automate');

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

// automate.run();

// automate.loadFiles('1. Lux Tests February 2021', (data) => {
// 	console.log('data', data)
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	console.log('lines', lines)
// 	const reg_num = lines.find(v => v.contains('Registration number:')).split('Registration number:')[1].trim().replaceAll(' ', '');
// 	const date = lines.find(v => v.contains('Date:')).trim().split('Date:')[1].trim();//.substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	// const expiry = lines.find(v => v.contains('Date of expiry')).split('Date of expiry')[1].trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
//
// 	data = {reg_num, date};
// 	return data;
// });

//To save
// automate.loadFiles('2. License Disc', (data) => {
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	const reg_num = lines.find(v => v.contains('Licence number')).split('Licence number')[1].trim().split(' ')[0].replaceAll(' ', '');
// 	const date = lines.find(v => v.contains('Datum')).trim().split('Datum')[0].trim().substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	const expiry = lines.find(v => v.contains('Date of expiry')).split('Date of expiry')[1].trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
//
// 	data = {reg_num, date: date ? `20${date}`: null, expiry};
// 	return data;
// });

// automate.loadFiles('3. Brake Test', (data) => {
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	console.log('lines', lines)
// 	const reg_num = lines.find(v => v.contains('Licence number and')).split('Licence number and')[1].trim().replaceAll(' ', '');
// 	const date = lines.find(v => v.contains('Date:')).trim().split('Date:')[1].trim();//.substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	// const expiry = lines.find(v => v.contains('Date of expiry')).split('Date of expiry')[1].trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
//
// 	data = {reg_num, date};
// 	return data;
// });

//To save
// automate.loadFiles('3. COF', (data, filePath) => {
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	// console.log('lines', lines)
// 	let reg_num;
// 	try{
// 		reg_num = lines.find(v => v.contains('Licence number and')).split('Licence number and')[1].trim().split(' ')[0].trim().replaceAll(' ', '');
// 	} catch (e) {
//
// 	}
// 	let date;
// 	try{
// 		date = lines.find(v => v.contains('Date of issue')).trim().split('Date of issue')[1].trim().split(' ')[0].trim();//.substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	} catch (e) {
//
// 	}
// 	let expiry = Dates.parse(date);
// 	expiry = expiry ? Dates.formatDateSQL(expiry.addDays(60)) : null;
//
// 	data = {reg_num, date, expiry};
// 	return data;
// });

module.exports = router;