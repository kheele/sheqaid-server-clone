const path = require("path");
const {JsExcelTemplate} = require("../../../../libs/JsExcelTemplate");
const {sendEmail} = require("./send_email");
const {send_curr_year, send_missed} = require("./createSheets");
const {sendImpl} = require("../send__users_impl");

//<editor-fold desc="send_users">
exports.send = async (user_list) => {
	return sendImpl(user_list, send_final);
};
//</editor-fold>

//<editor-fold desc="send_final">
const send_final = async ({email, name, company_name, item}) => {
	const {
		list_missed,
		list_curr_year,
	} = item;

	const sheets = [];

	await send_missed({sheets, list: list_missed});
	await send_curr_year({sheets, list: list_curr_year});

	const attachments = [];

	for (let n = 0; n < sheets.length; n++) {
		const sheetInfo = sheets[n];
		const {rows, sheetName} = sheetInfo;

		const template_filename = path.join(__dirname, `xlsx/Template-List-${sheetName.replace(`(${new Date().getFullYear()})`, '')}.xlsx`)
		const template = await JsExcelTemplate.fromFile(template_filename);

		template.set('company_name', company_name);
		template.set('date', Dates.formatDate(new Date()));
		template.set('documents_title', sheetName);
		template.set("rows", rows);

		const buffer = await template.toBuffer();
		const base64 = buffer.toString('base64');

		const filename = `${sheetName}_(${Dates.formatDate(new Date())}).xlsx`;
		attachments.push({
			filename,
			content: base64,
			encoding: 'base64'
		});
	}

	if (!attachments.isEmpty()) {
		console.log("send_final", email)
		if (email === 'edward2@sheqsolve.com') {
			email = 'edward@sheqsolve.com';
		}
		// email = 'kheelet@gmail.com';

		const notifMsg = `
			<p>As a valued user of our platform, we would like to notify you that the <b>${attachments.length} Training Plan Expiry Spreadsheets</b> are now available for your reference.</p>\n

			<p>Please find the aforementioned attachments enclosed with this email. They contain crucial information regarding the expiration dates of various documents, which are essential for the smooth functioning of your organization. 
			We highly recommend that you review these spreadsheets carefully and take appropriate actions in a timely manner to ensure that all necessary documents are updated and renewed accordingly.</p>\n

			<p>If you have any queries or concerns regarding the <b>Training Plan Expiry Spreadsheets</b>, please do not hesitate to contact us. 
			We are always here to assist you in any way we can.</p>\n

			<p>Thank you for your continued support and trust in our services.</p>\n
		`;

		await sendEmail({
			email,
			name,
			notifMsg,
			attachments,
		});
	}
};
//</editor-fold>
