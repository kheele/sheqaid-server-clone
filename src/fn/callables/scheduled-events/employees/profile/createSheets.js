
module.exports = async ({list}) => {
	if (list && !list.isEmpty()) {
		const rows = list.map((
			{
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
				client, project, site,
			}, idx
		) => {
			const res = {
				idx: idx + 1,
				id: id,
				company_name: client && client.name || '-',
				project_name: project && project.name || '-',
				site_name: site && site.name || '-',

				fname,
				lname,

				id_or_passport_num: id_num || passport_num,

				sex: sex || '-',
				dob: Dates.formatDate(dob) || '-',

				phone: phone || '-',
				email: email || '-',
				employment_num: employment_num || '-',
				employment_date: Dates.formatDate(employment_date) || '-',

				job_position_name: job_position && job_position.name || '-',
				department_name: department && department.name || '-',
			};

			return res;
		});

		const sheet = {rows};
		return sheet;
	}
};
