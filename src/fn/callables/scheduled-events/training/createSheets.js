
const createSheets = async ({sheets, list, sheetName, onProcess}) => {
	if (list && !list.isEmpty()) {
		const rows = list.map((
			item, idx
		) => {
			const {
				id,
				fname,
				lname,
				dob,
				sex,
				id_num,
				passport_num,
				phone,
				email,
				employment_num,
				employment_date,
				job_position,
				department,
				//
				list_missed,//[course, year, completion_status]
				list_curr_year,//[course, year, completion_status]
				//
				client, project, site,
			} = item;
			return onProcess(item).map(({course, year, completion_status}) => ({
				id: id,
				company_name: client && client.name || '-',
				project_name: project && project.name || '-',
				site_name: site && site.name || '-',

				fname,
				lname,
				id_or_passport_num: id_num || passport_num,
				gender: sex || '-',

				employment_num: employment_num || '-',

				job_position_name: job_position && job_position.name || '-',
				department_name: department && department.name || '-',

				course_name: course && course.name || '-',
				year: year || '-',
				completion_status: completion_status || '-',
			}));
		}).reduce((a, b) => [...a, ...b], []);

		// rows.sort

		const sheet = {rows, sheetName};
		sheets.push(sheet);
	}
};

exports.send_curr_year = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Trainings-To-Do(${new Date().getFullYear()})`, onProcess: ({list_curr_year}) => list_curr_year,
	});
};

exports.send_missed = async ({sheets, list}) => {
	return createSheets({
		sheets, list, sheetName: `Trainings-Missed-In-Past-Years`, onProcess: ({list_missed}) => list_missed,
	});
};