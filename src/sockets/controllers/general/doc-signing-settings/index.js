require('./submissions');
require('./submitters');
require('./templates');

const jwt = require('jsonwebtoken');

const {DOCUSEAL_API_KEY, DOCUSEAL_USER_EMAIL} = process.env;

const URL = "doc-signing-settings/api/docuseal";

eventManager.on(`${URL}/token`, async (socket, data) => {
	if (!data) return;

	console.log(`${URL}/token`, data)

	const {
		plugin_key,
		module_key,
		doc,
		doc_name: name,
		// external_id,
	} = data;

	const folder_name = `${plugin_key}/${module_key}`;

	const token = jwt.sign({
		user_email: DOCUSEAL_USER_EMAIL,
		// integration_email: 'saas-user@company.com',
		// external_id: 'TestForm123',
		name,
		folder_name,
		// document_urls: [url],
		document_urls: ['https://www.irs.gov/pub/irs-pdf/fw9.pdf'],
	}, DOCUSEAL_API_KEY);

	return token;

	// const { rows } = await db.query('SELECT * FROM templates ORDER BY id ASC');
	//
	// if (rows.length === 0) {
	// 	return res.status(422).json({ error: 'Create at least one template' });
	// } else {
	// 	const token = jwt.sign({
	// 		user_email: process.env.DOCUSEAL_USER_EMAIL,
	// 		external_id: rows[0].id
	// 	}, process.env.DOCUSEAL_API_KEY)
	//
	// 	res.json({ token });
	// }
});

eventManager.on(`${URL}/webhooks`, async (socket, data) => {
	// const body = req.body;
	// const { event_type, data } = body;
	//
	// if (['form.viewed', 'form.started', 'form.completed'].includes(event_type) && data) {
	// 	const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE external_id = $1', [data.id]);
	// 	const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE external_id = $1', [data.template.id]);
	// 	const submitter = submitterRows[0];
	// 	const template = templateRows[0];
	//
	// 	if (submitter) {
	// 		await db.query('UPDATE submitters SET opened_at = $1, completed_at = $2, status = $3 WHERE external_id = $4', [data.opened_at, data.completed_at, data.status, data.id]);
	// 	} else if (template) {
	// 		loadSubmission(template.id, data.submission_id)
	// 	}
	// }
	//
	// res.status(200).json({ message: 'Webhook received' });
});
