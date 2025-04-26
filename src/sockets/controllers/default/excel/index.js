const {
	createExcelFileSheets,
	createExcelFile,
	onReadAsJson,
} = require('./api.js');

class Cntr extends ACntr {
	constructor() {
		super('excel/');

		const {addAction} = this;
		addAction('createExcelFileSheets', this.createExcelFileSheets.bind(this));
		addAction('createExcelFile', this.createExcelFile.bind(this));
		addAction('onReadAsJson', this.onReadAsJson.bind(this));
	}

	async createExcelFileSheets(socket, data) {
		return createExcelFileSheets(data);
	}

	async createExcelFile(socket, data) {
		return createExcelFile(data);
	}

	async onReadAsJson(socket, data) {
		return onReadAsJson(data);
	}

}

module.exports = new Cntr();
