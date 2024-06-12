const path = require("path");
const {JsExcelTemplate} = require("../../../../../libs/JsExcelTemplate");
const {sendEmail} = require("./send_email");
const createSheets = require("./createSheets");
const {sendImpl} = require("../../send__users_impl");

//<editor-fold desc="send_users">
exports.send = async (user_list) => {
	return sendImpl(user_list, send_final);
};
//</editor-fold>

//<editor-fold desc="send_final">
const send_final = async ({email, name, company_name, item}) => {
	const {
		list,
	} = item;

	const sheetInfo = await createSheets({list});
	if (!sheetInfo) return;

	const {rows} = sheetInfo;

	const template_filename = path.join(__dirname, `xlsx/Template-List-Employees-Incomplete-Profiles.xlsx`)
	const template = await JsExcelTemplate.fromFile(template_filename);

	template.set('company_name', company_name);
	template.set('date', Dates.formatDate(new Date()));
	template.set("rows", rows);

	template.applyMissingValuesColor();

	const buffer = await template.toBuffer();
	const base64 = buffer.toString('base64');

	const filename = `Employees-Incomplete-Profiles_(${Dates.formatDate(new Date())}).xlsx`;
	const attachments = [{
		filename,
		content: base64,
		encoding: 'base64'
	}];

	console.log("send_final", email)
	if (email === 'edward2@sheqsolve.com') {
		email = 'edward@sheqsolve.com';
	}
	// email = 'kheelet@gmail.com';

	const {length} = attachments;
	const title = `Employee Incomplete Profile Spreadsheet${length > 0 ? "s":""}`;

	const notifMsg = `
			<p>As a valued user of our platform, we would like to notify you that <b>${length} ${title}</b> are now available for your reference.</p>\n

			<p>Please find the aforementioned attachments enclosed with this email. They contain crucial information regarding the expiration dates of various documents, which are essential for the smooth functioning of your organization. 
			We highly recommend that you review these spreadsheets carefully and take appropriate actions in a timely manner to ensure that all necessary documents are updated and renewed accordingly.</p>\n

			<p>If you have any queries or concerns regarding the <b>${title}</b>, please do not hesitate to contact us. 
			We are always here to assist you in any way we can.</p>\n

			<p>Thank you for your continued support and trust in our services.</p>\n
		`;

	await sendEmail({
		email,
		name,
		notifMsg,
		attachments,
	});
};
//</editor-fold>
