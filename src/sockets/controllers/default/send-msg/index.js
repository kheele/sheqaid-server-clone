
class Cntr extends ACntr {
	constructor() {
		super('send-msg/');

		const {addAction} = this;
		addAction('sendEmail', this.sendEmail.bind(this));
	}

	async sendEmail(socket, opts) {
		// console.log('data', data)
		if (!opts) return;
		
		opts.from = '"SHEQ Aid" <no-reply@sheqsolve.com>';
		await EmailUtils.send(opts);
	}

}

module.exports = new Cntr();
