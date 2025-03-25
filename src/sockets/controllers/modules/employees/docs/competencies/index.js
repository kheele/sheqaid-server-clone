const findByIdImpl = require("../../../findByIdImpl");
const exportExcelImpl = require("../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults,
} = require("../hrDocsDashboardImpl");
const updateImpl = require("../../../updateImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {inc_fragment} = require("./commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {getDateRangeDashboardFragment} = require("../hrDocsDateRangeDashboardImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const {createCompetency} = require("./create");

const args = {
	name: 'Competencies',
	tbl: 'hr_employees_docs_competencies',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/competencies/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/competencies`;

eventManager.on(`${path}/create`, createCompetency);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: 'Competencies',
	listName: "competency_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: 'Competencies',
	listName: "competency_list"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: 'Competencies',
	listName: "competency_list",
	details_fragment: getHRDocsDashboardFragment("competency_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: 'Competencies',
	listName: "competency_list",
	details_fragment: getDateRangeDashboardFragment("competency_list"),
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, removed,
				company, client, project, site,

				accreditation_num,
				certificate_num,
				competency_type,
				type,
				doc,
				issued_date,
				expiry_date,
				expiry_updated,
				training,
				employee,
			}
		} = item;

		return {
			idx: idx + 1,
			id,

			project: project && project.name,
			site: site && site.name,

			full_name: employee && employee.full_name,
			id_or_passport: employee && (employee.id_num || employee.passport_num),
			job_position: employee && employee.job_position && employee.job_position.name,
			employment_num: employee && employee.employment_num,

			issued_date: Dates.formatDate(issued_date),
			course: training && training.course && training.course.name,
			accreditation_num,
			certificate_num,
			type,
			competency_type,
			expiry_date: Dates.formatDate(expiry_date),
			// doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));
//74