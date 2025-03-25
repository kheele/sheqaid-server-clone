// <editor-fold defaultstate="collapsed" desc="imports">
const {v4: uuidv4} = require('uuid');
const {query: findByIdProxyContractorSite} = require("../../fn/callables/graphql/ProxyContractorSite/findByIdProxyContractorSite");

const {onSetCustomUserClaims, onResetPassword} = require('./accounts_impl');
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendWelcomeEmail">
/**
 * Sends a welcome email based on the item_type specified in the body data.
 * Queries and processes the recipient details to send the appropriate email.
 *
 * @param {Object} body - Contains the data used to determine the recipient and type of email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
exports.sendWelcomeEmail = async (body) => {
	await authorize();
	
	if (!body) return;
	
	const {data} = body;
	if (!data) return;
	
	console.log('sendWelcomeEmail', data);
	
	const {
		table: {
			table_name,
			schema,
			item_type,
			new_item,
		}
	} = data;
	
	if (item_type === "Contractor") {
		return sendWelcomeEmailContractor(data);
	}
	if (item_type === "ContractorUserSignup") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "ContractorUserCreate") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "UserSignup") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "UserCreate") {
		// return sendWelcomeEmailContractor(data);
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendWelcomeOTP">
/**
 * Sends a welcome OTP email based on the item_type specified in the body data.
 * Processes the recipient details to send the OTP email if new_item.password_otp is present.
 *
 * @param {Object} body - Contains the data used to determine the recipient and type of OTP email.
 * @returns {Promise<void>} - A promise that resolves when the OTP email is sent.
 */
exports.sendWelcomeOTP = async (body) => {
	await authorize();
	
	const {data} = body;
	if (!data) return;
	
	const {
		table: {
			table_name,
			schema,
			item_type,
			old_item,
			new_item,
		}
	} = data;
	
	if (!new_item || !new_item.password_otp) {
		return;
	}
	
	// const otp = uuidv4().substring(0, 5);
	
	if (item_type === "Contractor") {
		return sendWelcomeOTPContractor(data);
	}
	if (item_type === "ContractorUserSignup") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "ContractorUserCreate") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "UserSignup") {
		// return sendWelcomeEmailContractor(data);
	}
	if (item_type === "UserCreate") {
		// return sendWelcomeEmailContractor(data);
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendNewContractorSiteEmail">
/**
 * Sends an email notification when a new contractor site is assigned.
 * Retrieves contractor and site details and sends notifications to relevant users.
 *
 * @param {Object} body - Contains the data used to determine the recipient and type of notification email.
 * @returns {Promise<void>} - A promise that resolves when the notification emails are sent.
 */
exports.sendNewContractorSiteEmail = async (body) => {
	await authorize();
	
	const {data} = body;
	if (!data) return;
	
	const {
		table: {
			table_name,//proxy_contractors__sites
			schema,
			item_type,
			old_item,
			new_item,
		}
	} = data;
	
	if (!new_item) {
		return;
	}
	
	if (item_type === "ContractorSite") {
		const {id, contractor_id, site_id, status, inc_contractor_pack} = new_item;
		const item = await getRelayOne({
			query: findByIdProxyContractorSite,
			operationName: 'findByIdProxyContractorSiteQuery',
			variables: {id},
		});
		if (!item) {
			return;
		}
		
		const {contractor, site} = item.data;
		
		const {name: siteName, project, client, company, user_list: site_user_list} = site;
		const {name: projectName, user_list: project_user_list} = project;
		const {name: clientName, email, contractor_email, user_list: client_user_list} = client;
		const {name: companyName, user_list: company_user_list} = company;
		
		const only_company_user_list = company_user_list.filter(({site_id}) => !site_id).filter(({project_id}) => !project_id).filter(({client_id}) => !client_id);
		const only_client_user_list = client_user_list.filter(({site_id}) => !site_id).filter(({project_id}) => !project_id);
		const only_project_user_list = project_user_list.filter(({site_id}) => !site_id);
		const only_site_user_list = site_user_list;
		
		const {name: contractorName, username: contractorUsername, user_list: contractor_user_list} = contractor;
		
		const list = [...only_site_user_list, ...only_project_user_list, ...only_client_user_list, ...only_company_user_list].distinct("id");
		
		const sendEmail = async ({name, username, isContractor}) => {
			let msg;
			if (isContractor) {
				msg = `Your contractor has been assigned the site on the SHEQ Aid (Contractors Management) system.`;
			} else {
				msg = `Your company has assigned the site to a contractor the SHEQ Aid (Contractors Management) system.`;
			}
			const html = `<h3><b>Dear ${name}</b></h3>\n
                <p>${msg}</p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Site Name: ${siteName}</p>\n
                <p>Project Name: ${projectName}</p>\n
                <p>Company Name: ${clientName || companyName}</p>\n
                <p>Site Status: ${status}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for using the SHEQ Aid system.</p>\n
                <p>If you didn't request this, you can ignore this email or let us know.</p>\n
                ${getAppDownloadOptionMsg({isContractor, showOnlyAccess: true})}`;
			
			const opts = {
				from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
				to: username,
				subject: 'New Site Assigned in SHEQ Aid (Contractors Management) system',
				html,
			};
			
			await EmailUtils.send(opts);
		};
		
		await Promise.all([
			Promise.all(list.map(async ({id, fname, lname, username}) => {
				return sendEmail({name: `${fname} ${lname}`, username, isContractor: false});
			})),
			Promise.all(contractor_user_list.map(async ({id, fname, lname, username}) => {
				return sendEmail({name: `${fname} ${lname}`, username, isContractor: true});
			})),
			sendEmail({name: `${contractorName}`, username: contractorUsername, isContractor: true}),
		]);
		
		return true;
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendUpdateStatusContractorSiteEmail">
/**
 * Sends an email notification when the status of a contractor site is updated.
 * Retrieves contractor and site details and sends notifications to relevant users about the status change.
 *
 * @param {Object} body - Contains the data used to determine the recipient and type of status update notification email.
 * @returns {Promise<boolean>} - A promise that resolves to true if the emails are sent successfully, otherwise false.
 */
exports.sendUpdateStatusContractorSiteEmail = async (body) => {
	await authorize();
	
	const {data} = body;
	if (!data) return;
	
	const {
		table: {
			table_name,//proxy_contractors__sites
			schema,
			item_type,
			old_item,
			new_item,
		}
	} = data;
	
	if (item_type === "ContractorSite") {
		if (!new_item) {
			return;
		}
		if (old_item.status !== new_item.status) {
			const {id, contractor_id, site_id, status, inc_contractor_pack} = new_item;
			const item = await getRelayOne({
				query: findByIdProxyContractorSite,
				operationName: 'findByIdProxyContractorSiteQuery',
				variables: {id},
			});
			if (!item) {
				return;
			}
			
			const {contractor, site} = item.data;
			
			const {name: siteName, project, client, company, user_list: site_user_list} = site;
			const {name: projectName, user_list: project_user_list} = project;
			const {name: clientName, email, contractor_email, user_list: client_user_list} = client;
			const {name: companyName, user_list: company_user_list} = company;
			
			const only_company_user_list = company_user_list.filter(({site_id}) => !site_id).filter(({project_id}) => !project_id).filter(({client_id}) => !client_id);
			const only_client_user_list = client_user_list.filter(({site_id}) => !site_id).filter(({project_id}) => !project_id);
			const only_project_user_list = project_user_list.filter(({site_id}) => !site_id);
			const only_site_user_list = site_user_list;
			
			const {name: contractorName, username: contractorUsername, user_list: contractor_user_list} = contractor;
			
			const list = [...only_site_user_list, ...only_project_user_list, ...only_client_user_list, ...only_company_user_list].distinct("id");
			
			const sendEmail = async ({name, username, isContractor}) => {
				let msg;
				if (isContractor) {
					msg = `The site assigned to your contractor has been ${status} on the SHEQ Aid (Contractors Management) system.`;
				} else {
					msg = `The site your company has assigned to the contractor has been ${status} on the SHEQ Aid (Contractors Management) system.`;
				}
				
				const html = `<h3><b>Dear ${name}</b></h3>\n
                <p>${msg}</p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Site Name: ${siteName}</p>\n
                <p>Project Name: ${projectName}</p>\n
                <p>Company Name: ${clientName || companyName}</p>\n
                <p>Site Status: ${status}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>If you didn't request this, you can ignore this email or let us know.</p>\n
                ${getAppDownloadOptionMsg({isContractor, showOnlyAccess: true})}`;
				
				const opts = {
					from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
					to: username,
					subject: `Site ${status} on SHEQ Aid (Contractors Management)`,
					html,
				};
				
				await EmailUtils.send(opts);
			};
			
			await Promise.all([
				//company
				Promise.all(list.map(async ({id, fname, lname, username}) => {
					return sendEmail({name: `${fname} ${lname}`, username, isContractor: false});
				})),
				sendEmail({name: `${clientName || companyName}`, username: contractor_email || email, isContractor: false}),
				//contractor
				Promise.all(contractor_user_list.map(async ({id, fname, lname, username}) => {
					return sendEmail({name: `${fname} ${lname}`, username, isContractor: true});
				})),
				sendEmail({name: `${contractorName}`, username: contractorUsername, isContractor: true}),
			]);
			
			return true;
		}
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
/**
 * Handles the custom user claims assignment based on the provided access type.
 * Queries user data from the database, processes the user data, and assigns custom claims.
 *
 * @param {Object} decodedIdToken - The decoded authentication token containing user information.
 * @param {string} access_type - The type of access (e.g., "User", "ContractorUser") used to determine the query and claims.
 * @returns {Promise<Object|null>} - A promise that resolves to an object with `loggedUser`, `customToken`, and `customClaims`, or null in case of error.
 */
exports.onSetCustomUserClaims = onSetCustomUserClaims;
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
/**
 * Handles password reset requests.
 * Processes the password reset for the user based on the provided information.
 *
 * @param {Object} body - Contains the data used to process the password reset.
 * @returns {Promise<void>} - A promise that resolves when the password reset is processed.
 */
exports.onResetPassword = onResetPassword;
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="unexported">
// <editor-fold defaultstate="collapsed" desc="sendWelcomeEmailContractor">
/**
 * Sends a welcome email to a contractor.
 * Constructs and sends a welcome email containing account setup information to the contractor.
 *
 * @param {Object} data - Contains the data used to generate and send the welcome email to the contractor.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is sent successfully, otherwise false.
 */
const sendWelcomeEmailContractor = async (data) => {
	const {
		table: {
			table_name,
			schema,
			item_type,
			new_item,
		}
	} = data;
	
	console.log('sendWelcomeEmailContractor new_item', new_item);
	
	const {
		id,
		company_id,
		client_id,
		project_id,
		user_id,
		created_at,
		inc_contractor_pack,
		name: contractorName,
		username,
		password_otp,
	} = new_item;
	
	const html = `<h3><b>Dear ${contractorName}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>Please use <b>${username}</b> as your Username in order to set up your account.</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>If you didn't request this, you can ignore this email or let us know.</p>\n
                ${getAppDownloadOptionMsg({isContractor: true})}`;
	
	console.log('sendWelcomeEmailContractor html', html);
	
	const opts = {
		from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
		to: username,
		subject: 'Welcome to SHEQ Aid (Contractors Management)',
		html,
	};
	
	await EmailUtils.send(opts);
	
	console.log('sendWelcomeEmailContractor sent');
	
	return true;
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendWelcomeOTPContractor">
/**
 * Sends a welcome OTP email to a contractor.
 * Constructs and sends an OTP email to the contractor for account setup.
 *
 * @param {Object} data - Contains the data used to generate and send the OTP email to the contractor.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is sent successfully, otherwise false.
 */
const sendWelcomeOTPContractor = async (data) => {
	const {
		table: {
			table_name,
			schema,
			item_type,
			old_item,
			new_item,
		}
	} = data;
	
	const {
		id,
		company_id,
		client_id,
		project_id,
		user_id,
		created_at,
		inc_contractor_pack,
		name: contractorName,
		username,
		password_otp,
	} = new_item;
	
	const html = `<h3><b>Dear ${contractorName}</b></h3>\n
                <p>We are pleased to inform you that we have sent you a One-Time Password (OTP) to use to set up your account on the SHEQ Aid system.</p>\n
                <p>Please use the following OTP:</p>\n
                <p style="font-size: 20px"><b>${password_otp}</b></p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>If you didn't request this, you can ignore this email or let us know.</p>\n
                ${getAppDownloadOptionMsg({isContractor: true})}`;
	
	const opts = {
		from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
		to: username,
		subject: 'One-Time Password (OTP) from SHEQ Aid (Contractors Management)',
		html,
	};
	
	await EmailUtils.send(opts);
	return true;
};
// </editor-fold>

//<editor-fold desc="getAppDownloadOptionMsg">
/**
 * Generates a message containing app download options.
 * Provides different download options based on the user type and access requirements.
 *
 * @param {Object} params - Parameters to determine the message content, including user type and access options.
 * @param {boolean} [params.isEmployee=false] - Indicates if the user is an employee.
 * @param {boolean} [params.isContractor=false] - Indicates if the user is a contractor.
 * @param {boolean} [params.showOnlyAccess=false] - Indicates if only access options should be shown.
 * @returns {string} - The generated message containing app download options.
 */
global.getAppDownloadOptionMsg = (params = {}) => {
	const {isEmployee = false, isContractor = false, showOnlyAccess = false} = params || {};
	
	if (showOnlyAccess) {
		let path;
		if (isContractor) {
			path = 'https://contractors.sheqintel.com';
		} else {
			path = 'https://web.sheqintel.com';
		}
		return `
            <p>Please access the application from one of the following option:</p>
            <p>1. On Web/Cloud: use this <a target="_blank" href="${path}">${path}</a>.</p>
            <p>2. On Windows: download the application <a target="_blank" href="${path}/updater/sheqassist-1.1.0.exe">here</a>.</p>
            <p>Best Regards<br/>SHEQ Aid</p>
        `;
	}
	
	if (isContractor) {
		const path = 'https://contractors.sheqintel.com';
		return `
            <p>
                Note: <br/>
                1. Use the <b>username</b> provided above to log in,<br/>
                2. We will send you <b>One-Time Password (OTP)</b>,<br/>
                3. You will be required to <b>verify</b> the <b>OTP</b> sent to you,<br/>
                4. Then set up the <b>administrator</b> of your account,<br/>
                5. You can add <b>additional users</b> in the system if needed<br/>
            </p>
            <p>Please access the application from one of the following option:</p>
            <p>1. On Web/Cloud: use this <a target="_blank" href="${path}">${path}</a>.</p>
            <p>2. On Windows: download the application <a target="_blank" href="${path}/updater/sheqassist-1.1.0.exe">here</a>.</p>
            <p>Best Regards<br/>SHEQ Aid</p>
        `;
	}
	
	const path = 'https://web.sheqintel.com';
	return `<p>Note: ${!isEmployee ? 'use the username and password provided to login' : 'login the application to setup your Password'}</p>
            ${!isEmployee ? '<p>You are strongly advised to change your password as soon as you login in to SHEQ Aid account</p>' : ''} 
            <p>Please access the application from one of the following option:</p>
            <p>1. On Web/Cloud: use this <a target="_blank" href="${path}">https://web.sheqintel.com</a>.</p>
            <p>2. On Windows: download the application <a target="_blank" href="${path}/updater/sheqassist-1.1.0.exe">here</a>.</p>
            <p>Best Regards<br/>SHEQ Aid</p>`;
};
//</editor-fold>
// </editor-fold>
