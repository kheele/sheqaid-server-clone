const moment = require("moment");

const createSheets = async ({sheets, list, sheetName, onProcess}) => {
	if (list && !list.isEmpty()) {
		const rows = list.map((
			{
				id,
				created_at,
				//1
				type,
				priority,
				//2
				desc, process,
				//3
				due_date, responsible_person, approving_person,
				//4
				document_list,
				//5
				comments, remarks,
				//6
				progress_list,
				//7
				status_acceptance, status_progress, result, completed_date, additional_notes,
				//
				client, project, site,
			}, idx
		) => {

			const res = {
				idx: idx + 1,
				id: id,
				company_name: client && client.name || "",
				project_name: project && project.name || "",
				site_name: site && site.name || "",

				responsible_person_name: responsible_person ? (responsible_person.lname + " " + responsible_person.fname) : "N/A",
				approving_person_name: approving_person ? (approving_person.lname + " " + approving_person.fname) : "N/A",

				type: type || "",
				priority: priority || "N/A",

				desc: desc || "N/A",
				status_acceptance: status_acceptance || "",
				status_progress: status_progress || "",
				completed_date: Dates.formatDate(completed_date) || "",
			};

			onProcess(res, due_date);

			return res;
		});

		const sheet = {rows, sheetName};
		sheets.push(sheet);
	}
};

exports.send_no_expiry = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Non-Conformances-With-No-Expiry`, onProcess: (res) => res.due_date = "N/A"
	});
};

exports.send_to_expire = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Non-Conformances-To-Expire-In-Month`, onProcess: (res, due_date) => {
			res.due_date = Dates.formatDate(due_date);
			res.days_left = moment(Dates.parse(due_date)).fromNow();
		}
	});
};

exports.send_expired = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Non-Conformances-Expired`, onProcess: (res, due_date) => {
			res.due_date = Dates.formatDate(due_date);
			res.days_passed = moment(Dates.parse(due_date)).fromNow();
		}
	});
};