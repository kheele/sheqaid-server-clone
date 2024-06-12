require('../../../../api/send');
const CheckUserById = require("../../../../fn/callables/graphql/CheckUserById");

class Cntr extends ACntr {
	constructor() {
		super('send/');
		
		const {addAction} = this;
		addAction('sendUserOTP', this.sendUserOTP.bind(this));
		addAction('confirmUserOTP', this.confirmUserOTP.bind(this));
		addAction('sendForgotPass', this.sendForgotPass.bind(this));
		addAction('sendAppLink', this.sendAppLink.bind(this));
	}
	
	async sendUserOTP(socket, data = {}) {
		// console.log('data', data)
		
		const {username, access_type} = data;
		
		if (isValidAccessType(access_type)) {
			return sendUserOTP(username, access_type);
		}
	}
	
	async confirmUserOTP(socket, data = {}) {
		console.log('data', data)
		
		const {access_type, username, code} = data;
		
		if (isValidAccessType(access_type)) {
			return confirmUserOTP({username, code}, access_type);
		}
	}
	
	async sendForgotPass(socket, data = {}) {
		// console.log('data', data)
		
		const {access_type, username} = data;
		
		if (isValidAccessType(access_type)) {
			return sendForgotPass(username, access_type);
		}
	}
	
	async sendAppLink(socket, data) {
		// console.log('sendAppLink', data)
		if (!data) return;
		
		const {id, access_type} = data;
		
		const queryData = CheckUserById[access_type];
		if (!queryData) {
			return null;
		}
		
		const item = await getRelayOne({
			...queryData,
			variables: {id},
		});
		console.log('CheckUserById item', item)
		if (!item) {
			return 'NO_DB_USER';
		}
		
		const {data: {auth_id, fname, lname}} = item;
		
		return adminAuth(access_type).getUser(auth_id).then(async (userRecord) => {
			if (!userRecord) {
				return "NO_USER_AUTH";
			}
			
			const {uid, email, phoneNumber} = userRecord;
			
			await EmailUtils.send({
				from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
				to: email,
				subject: 'SHEQ Aid Application Link',
				html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
              <p>If you have not yet used SHEQ Aid Application, please use the links below to access the application.</p>\n\
              <p>Your SHEQ Aid Username is <b>' + email + '</b></p>\n\
              ' + getAppDownloadOptionMsg({/*isContractor, */showOnlyAccess: true}),
			});
			
			return true;
		}).catch(err => {
			if (err.code === "auth/user-not-found") {
				return "NO_USER_AUTH";
			}
			throw err;
		});
	}
	
}

module.exports = new Cntr();
