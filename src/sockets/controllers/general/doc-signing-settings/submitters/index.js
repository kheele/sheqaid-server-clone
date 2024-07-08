const jwt = require('jsonwebtoken');

const {DOCUSEAL_API_KEY} = process.env;

const URL = "doc-signing-settings/api/docuseal/submitters";

eventManager.on(`${URL}/list`, async (socket, slug) => {
	// const { rows: submissionRows } = await db.query('SELECT * FROM submissions ORDER BY id DESC');
	//
	// if (submissionRows.length === 0) return res.json({ submissions: [] });
	//
	// const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE submission_id = ANY($1) ORDER BY id DESC', [submissionRows.map((submission) => submission.id)]);
	// const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = ANY($1)', [submissionRows.map((submission) => submission.template_id)]);
	//
	// res.json({
	// 	submissions: submissionRows.map((submission) => {
	// 		return {
	// 			id: submission.id,
	// 			template: templateRows.find((template) => template.id === submission.template_id),
	// 			submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
	// 		}
	// 	})
	// });
});

eventManager.on(`${URL}/findById`, async (socket, id) => {
	// const { id: submissionId } = req.params;
	//
	// const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE submission_id = $1 ORDER BY id DESC', [submissionId]);
	//
	// if (submitterRows.length === 0) {
	// 	return res.status(404).json({ error: 'Submitters not found' });
	// }
	//
	// res.json({
	// 	submitters: submitterRows
	// });
});

eventManager.on(`${URL}/create`, async (socket, template_id) => {
	const { template_id: templateId } = req.params;
	const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

	if (templateRows.length === 0) {
		return res.status(404).json({ error: 'Template not found' });
	}

	res.json({ template: templateRows[0] });
});

//Fix
eventManager.on(`${URL}/sign`, async (socket, slug) => {
	if(!slug) return;

	// const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE slug = $1', [slug]);
	// const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE slug = $1', [slug]);
	//
	// if (submitterRows.length > 0) {
	// 	res.json({ submitter: submitterRows[0] });
	// } else if (templateRows.length > 0) {
	// 	res.json({ submitter: { slug: slug, email: 'test@example.com' } });
	// } else {
	// 	res.status(404).json({ error: 'Submitter not found' });
	// }
});
