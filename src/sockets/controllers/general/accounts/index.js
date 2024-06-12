require('../../../../api/accounts');

const {
	sendWelcomeEmail,
	sendWelcomeOTP,
	sendNewContractorSiteEmail,
	sendUpdateStatusContractorSiteEmail,
	onResetPassword,
} = accountsApi;

class Cntr extends ACntr {
	constructor() {
		super('accounts/');
		
		const {addAction} = this;
		addAction('sign/out', this.signOut.bind(this));
		addAction('sign/onReAuthUser', this.onReAuthUser.bind(this));
		addAction('onSetCustomUserClaims', this._onSetCustomUserClaims.bind(this));
		addAction('sendWelcomeEmail', this.sendWelcomeEmail.bind(this));
		addAction('sendWelcomeOTP', this.sendWelcomeOTP.bind(this));
		addAction('sendNewContractorSiteEmail', this.sendNewContractorSiteEmail.bind(this));
		addAction('sendUpdateStatusContractorSiteEmail', this.sendUpdateStatusContractorSiteEmail.bind(this));
		addAction('onResetPassword', this.onResetPassword.bind(this));
	}
	
	async signOut(socket, data = {}) {
		// console.log('data', data)
		
		let {access_type} = data;
		const {session, session: {decodedIdToken, sessionCookie}} = socket.request;
		const {auth_id} = decodedIdToken || {};
		
		return signOut({
			session,
			sessionCookie: sessionCookie || '',
			access_type,
		}).then((res) => {
			if (res) {
				socket.leave(auth_id);
				
				delete session.sessionCookie;
				session.save();
				
				return res;
			}
		});
		// .catch((error) => {
		//     socket.handshake.headers.cookie = `session=`;
		//     return true;
		// });
	}
	
	async onReAuthUser(socket, data = {}) {
		// console.log('data', data)
		
		const {access_type, uid} = data;
		
		return onReAuthUser({
			access_type,
			uid,
		});
	}
	
	async _onSetCustomUserClaims(socket, data = {}) {
		// console.log('data', data)
		
		const {access_type, idToken, csrfToken} = data;
		// const {auth} = socket.handshake;
		const {session} = socket.request;
		
		console.log('_onSetCustomUserClaims', access_type, idToken, csrfToken);
		
		return onSetCustomUserClaims({
			idToken,
			csrfToken,
			access_type,
		}).then(async res => {//{sessionCookie, options, loggedUser, customToken, customClaims}
			console.log('_onSetCustomUserClaims user logged', socket.id);
			if (res && res.customToken) {
				const {customClaims, sessionCookie, decodedIdToken} = res;
				
				const {
					// access_type,
					loggedUser: {
						user: {id: user_id, auth_id}
					},
				} = customClaims;
				
				session.decodedIdToken = customClaims;
				session.sessionCookie = sessionCookie;
				session.save();
				
				socket.join(auth_id);
				
				console.log('user logged', socket.id, auth_id);
				
				const {loggedUser, customToken} = res;
				return {loggedUser, customToken};
			}
			return res;
		});
	}
	
	//Hasuara triggers
	async sendWelcomeEmail(socket, data = {}) {
		// console.log('data', data)
		
		return sendWelcomeEmail(data);
	}
	
	async sendWelcomeOTP(socket, data = {}) {
		// console.log('data', data)
		
		return sendWelcomeOTP(data);
	}
	
	async sendNewContractorSiteEmail(socket, data = {}) {
		// console.log('data', data)
		
		return sendNewContractorSiteEmail(data);
	}
	
	async sendUpdateStatusContractorSiteEmail(socket, data = {}) {
		// console.log('data', data)
		
		return sendUpdateStatusContractorSiteEmail(data);
	}
	
	//From forgot password page sent by email link
	async onResetPassword(socket, data = {}) {
		// console.log('data', data)
		
		const {access_type} = data;
		
		if (isValidAccessType(access_type)) {
			return onResetPassword(data, access_type);
		}
	}
	
}

module.exports = new Cntr();
