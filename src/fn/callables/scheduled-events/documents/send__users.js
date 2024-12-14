const path = require("path");
const {JsExcelTemplate} = require("../../../../libs/JsExcelTemplate");
const {sendEmail} = require("./send_email");
const {send_no_expiry, send_to_expire, send_expired} = require("./createSheets");
const {sendImpl} = require("../send__users_impl");

//<editor-fold desc="send_users">
exports.send = async (user_list) => {
	return sendImpl(user_list, send_final);
};
//</editor-fold>

//<editor-fold desc="send_final">
const send_final = async ({email, name, company_name, item}) => {
	const {
		list_project_plan_expired,
		list_project_plan_month_expiry,
		list_project_plan_no_expiry,
		//
		// list_ims_policy_expired,
		// list_ims_policy_month_expiry,
		// list_ims_policy_no_expiry,
		//
		list_general_document_expired,
		list_general_document_month_expiry,
		list_general_document_no_expiry,
	} = item;

	const sheets = [];

	await send_expired({sheets, list: list_project_plan_expired, group: "Project Plan"});
	await send_to_expire({sheets, list: list_project_plan_month_expiry, group: "Project Plan"});
	await send_no_expiry({sheets, list: list_project_plan_no_expiry, group: "Project Plan"});

	// await send_expired({sheets, list: list_ims_policy_expired, group: "IMS Policy"});
	// await send_to_expire({sheets, list: list_ims_policy_month_expiry, group: "IMS Policy"});
	// await send_no_expiry({sheets, list: list_ims_policy_no_expiry, group: "IMS Policy"});

	await send_expired({sheets, list: list_general_document_expired, group: "General Document"});
	await send_to_expire({sheets, list: list_general_document_month_expiry, group: "General Document"});
	await send_no_expiry({sheets, list: list_general_document_no_expiry, group: "General Document"});

	const attachments = [];

	for (let n = 0; n < sheets.length; n++) {
		const sheetInfo = sheets[n];
		const {rows, sheetName, group} = sheetInfo;

		const template_filename = path.join(__dirname, `xlsx/Template-List-${sheetName}.xlsx`)
		const template = await JsExcelTemplate.fromFile(template_filename);

		template.set('company_name', company_name);
		template.set('date', Dates.formatDate(new Date()));
		template.set('doc_type', group);
		template.set('documents_title', sheetName);
		template.set("rows", rows);

		const buffer = await template.toBuffer();
		const base64 = buffer.toString('base64');

		const filename = `${group.replaceAll(' ','_')}_(${sheetName})_(${Dates.formatDate(new Date())}).xlsx`;
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
			<p>As a valued user of our platform, we would like to notify you that the <b>${attachments.length} Documents Expiry Spreadsheets</b> are now available for your reference.</p>\n

			<p>Please find the aforementioned attachments enclosed with this email. They contain crucial information regarding the expiration dates of various documents, which are essential for the smooth functioning of your organization. 
			We highly recommend that you review these spreadsheets carefully and take appropriate actions in a timely manner to ensure that all necessary documents are updated and renewed accordingly.</p>\n

			<p>If you have any queries or concerns regarding the <b>Documents Expiry Spreadsheets</b>, please do not hesitate to contact us. 
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
