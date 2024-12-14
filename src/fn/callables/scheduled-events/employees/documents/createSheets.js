const moment = require("moment");

const createSheets = async ({sheets, list, sheetName, onProcess}) => {
	if (list && !list.isEmpty()) {
		const rows = list.map((
			{
				id,
				created_at,
				//
				company,
				client,
				project,
				site,
				//
				expiry_date,
				expiry_updated,
				doc,
				employee: {
					full_name,
					sex,
					dob,
					id_num,
					passport_num,
					email,
					phone,
					employment_num,
					employment_date,
					department,
					job_position,
				},

				removed,
				//
				date,
				annexture_3,
				restrictions,
			}, idx
		) => {

			const res = {
				idx: idx + 1,
				id: id,

				company: client && client.name || "",
				project: project && project.name || "",
				site: site && site.name || "",

				job_position: job_position && job_position.name,
				// department: department && department.name,
				// supervisor: supervisor && supervisor.full_name,

				id,
				full_name,
				id_or_passport: id_num || passport_num,
				// dob: Dates.formatDate(dob),
				// sex,
				// phone,
				// email,

				employment_num,
				employment_date: Dates.formatDate(employment_date),

				//
				// ...otherVals,
				expiry_date: Dates.formatDate(expiry_date),
				// expiry_updated,
				// doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',

				status: removed ? "Inactive" : "Active",
				//
				date: Dates.formatDate(date),
				annexture_3,
				restrictions,
			};

			onProcess(res, expiry_date);

			return res;
		});

		const sheet = {rows, sheetName};
		sheets.push(sheet);
	}
};

exports.send_no_expiry = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Medicals-With-No-Expiry`, onProcess: (res) => res.expiry_date = "N/A"
	});
};

exports.send_to_expire = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Medicals-To-Expire-In-Month`, onProcess: (res, expiry_date) => {
			res.expiry_date = Dates.formatDate(expiry_date);
			res.days_left = moment(Dates.parse(expiry_date)).fromNow();
		}
	});
};

exports.send_expired = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Medicals-Expired`, onProcess: (res, expiry_date) => {
			res.expiry_date = Dates.formatDate(expiry_date);
			res.days_passed = moment(Dates.parse(expiry_date)).fromNow();
		}
	});
};