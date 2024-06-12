const express = require('express');
const router = express.Router();

router.post('/out/:access_type', async (req, res) => {
	const {access_type} = req.params;
	signOut({
		session: req.session,
		sessionCookie: req.cookies.session || '',
		access_type,
	})
	.then((res) => {
		if(res) {
			res.clearCookie('session');
			res.json(res);
		} else {
			res.end();
		}
	})
	.catch((err) => {
		// res.clearCookie('session');
		res.end();
	});
});

router.post('/onReAuthUser/:access_type', async (req, res) => {
	const {access_type} = req.params;
	onReAuthUser({
		access_type,
		uid: req.body,
	}).then(data => {
		if(!data) {
			return res.end();
		}
		if(data instanceof String || typeof data === 'string') {
			return res.end(data);
		}
		res.json(data);
	});
});

module.exports = router;

