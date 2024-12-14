const moment = require("moment");

const createSheets = async ({sheets, list, group, sheetName, onProcess}) => {
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
				title,
				desc,
				internal_or_external,
				doc_type,
				category,
				responsible_department,
				responsible_person,
				employee,
				doc_version_list,
				latest_version,
				//
				client, project, site,
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
				company_name: client && client.name || "",
				project_name: project && project.name || "",
				site_name: site && site.name || "",

				responsible_department_name: responsible_department && responsible_department.name || "N/A",
				responsible_person_name: responsible_person ? (responsible_person.lname + " " + responsible_person.fname) : "N/A",
				employee_name: employee ? (employee.lname + " " + employee.fname) : "N/A",

				title: title || "",
				category_name: category && category.name || "N/A",

				doc_num: doc_num || "N/A",
				internal_or_external: internal_or_external || "",
			};

			onProcess(res, expiry);

			return res;
		});

		const sheet = {rows, sheetName, group};
		sheets.push(sheet);
	}
};

exports.send_no_expiry = async ({sheets, list, group}) => {
	return createSheets({
		sheets, list, group, sheetName: `Documents-With-No-Expiry`, onProcess: (res) => res.expiry = "N/A"
	});
};

exports.send_to_expire = async ({sheets, list, group}) => {
	return createSheets({
		sheets, list, group, sheetName: `Documents-To-Expire-In-Month`, onProcess: (res, expiry) => {
			res.expiry = Dates.formatDate(expiry);
			res.days_left = moment(Dates.parse(expiry)).fromNow();
		}
	});
};

exports.send_expired = async ({sheets, list, group}) => {
	return createSheets({
		sheets, list, group, sheetName: `Documents-Expired`, onProcess: (res, expiry) => {
			res.expiry = Dates.formatDate(expiry);
			res.days_passed = moment(Dates.parse(expiry)).fromNow();
		}
	});
};