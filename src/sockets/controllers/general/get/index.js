
require('../../../../api/get');

class Cntr extends ACntr {
	constructor() {
		super('get/');

		const {addAction} = this;
		addAction('getUserUidByUsername', this.getUserUidByUsername.bind(this));
		addAction('getUserUidByEmail', this.getUserUidByEmail.bind(this));
		addAction('getUserUidByPhone', this.getUserUidByPhone.bind(this));
	}

	async getUserUidByUsername(socket, data = {}) {
		// console.log('data', data)

		const {access_type, username} = data;
		
		if (isValidAccessType(access_type)) {
			return getUserUidByUsername(username, access_type);
		}
	}

	async getUserUidByEmail(socket, data = {}) {
		// console.log('data', data)

		const {access_type, email} = data;

		if (isValidAccessType(access_type)) {
			return getUserUidByEmail(email, access_type);
		}
	}

	async getUserUidByPhone(socket, data = {}) {
		// console.log('data', data)

		const {access_type, phone} = data;
		
		if (isValidAccessType(access_type)) {
			return getUserUidByPhone(phone, access_type);
		}
	}

}

module.exports = new Cntr();