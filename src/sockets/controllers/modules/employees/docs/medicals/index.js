const findByIdImpl = require("../../../findByIdImpl");
const exportExcelImpl = require("../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../hrDocsDashboardImpl");

const {
	getDateRangeDashboardFragment,
} = require("../hrDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const updateImpl = require("../../../updateImpl");
const {inc_fragment} = require("./commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const {createMedical} = require("./create");

const args = {
	name: 'Medicals',
	tbl: 'hr_employees_docs_medicals',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => {
		const d = Dates.formatTimestamp(new Date());
		const path = `employees/${employee.id}/docs/medicals/${id}`;
		return {
			new_names: [
				`${path}/Medical-doc-${d}`,
				`${path}/Medical-Annexture3-doc-${d}`,
			],
			keys: ['doc', 'annexture3_doc'],
		};
	},
};

const path = `employees/docs/medicals`;

eventManager.on(`${path}/create`, createMedical);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`employees/docs/medicals/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Medicals",
	listName: "medical_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/medicals/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Medicals",
	listName: "medical_list"
}));

eventManager.on(`employees/docs/medicals/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Medicals",
	listName: "medical_list",
	details_fragment: getHRDocsDashboardFragment("medical_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/medicals/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Medicals",
	listName: "medical_list",
	details_fragment: getDateRangeDashboardFragment("medical_list"),
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				project,
				site,
				employee,
				date,
				follow_up_date,
				annexture_3,
				fitness_option,
				restrictions,
				expiry_date,
				doc,
				annexture3_doc,
				removed,
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

			date: Dates.formatDate(date),
			follow_up_date: Dates.formatDate(follow_up_date),
			annexture_3,
			fitness_option,
			restrictions,
			expiry_date: Dates.formatDate(expiry_date),
			doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));
