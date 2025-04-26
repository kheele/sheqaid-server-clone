const express = require('express');
const router = express.Router();

const automate = require('./automate');

const {
	uploadNCRDocsUpdate,
} = require("./api.js");

router.put('/uploadNCRDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	await uploadNCRDocsUpdate(req.body);
	res.end();
});

// setTimeout(automate.run, 5000);

async function urlToBase64DataUrl(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch URL: ${response.statusText}`);
		}
		const buffer = await response.buffer();
		const base64 = buffer.toString('base64');
		const mimeType = response.headers.get('content-type');
		const dataUrl = `data:${mimeType};base64,${base64}`;
		return dataUrl;
	} catch (error) {
		console.error('Error:', error);
	}
}

// Example usage
// const url = 'https://storage.googleapis.com/sheqsolve.appspot.com/assets/489/208/photos/doc.PNG';
// urlToBase64DataUrl(url).then((dataUrl) => {
// 	console.log('Base64 Data URL:', dataUrl);
// });



module.exports = router;