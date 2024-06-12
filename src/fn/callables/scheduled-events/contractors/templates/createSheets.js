const moment = require("moment");

const createSheets = async ({sheets, list, sheetName, onProcess}) => {
	if (list && !list.isEmpty()) {
		const rows = list.map(v => {
			!v.doc_version_list && (v.doc_version_list = []);
			if (isArray(v.latest_version)) {
				v.latest_version = v.latest_version[0];
			}
			return v;
		}).map((
			{
				id,
				created_at, //1
				name,
				desc,
				category,
				contractor,
				contractor_site,
				doc_version_list,
				latest_version,
				//
				client,
			}, idx
		) => {

			const {
				// id,
				expiry,
				doc_num,
				type,
				doc,
			} = latest_version || {};

			const res = {
				idx: idx + 1,
				id: id,
				company_name: client && client.name || "-",
				project_name: contractor_site && contractor_site.project.name || "-",
				site_name: contractor_site && contractor_site.name || "",

				contractor_name: contractor && contractor.name || "-",

				name: name || "-",
				category_name: category || "-",

				doc_num: doc_num || "-",
			};

			onProcess(res, expiry);

			return res;
		});

		const sheet = {rows, sheetName,};
		sheets.push(sheet);
	}
};

exports.send_no_expiry = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Templates-With-No-Expiry`, onProcess: (res) => res.expiry = "-"
	});
};

exports.send_to_expire = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Templates-To-Expire-In-Month`, onProcess: (res, expiry) => {
			res.expiry = Dates.formatDate(expiry);
			res.days_left = moment(Dates.parse(expiry)).fromNow();
		}
	});
};

exports.send_expired = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Templates-Expired`, onProcess: (res, expiry) => {
			res.expiry = Dates.formatDate(expiry);
			res.days_passed = moment(Dates.parse(expiry)).fromNow();
		}
	});
};