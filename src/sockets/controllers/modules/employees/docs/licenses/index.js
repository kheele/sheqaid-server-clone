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
const {createLicense} = require("./create");

const args = {
	name: 'Licenses',
	tbl: 'hr_employees_docs_licenses',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/licenses/${id}/License-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/licenses`;

eventManager.on(`${path}/create`, createLicense);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Licenses",
	listName: "license_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Licenses",
	listName: "license_list"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Licenses",
	listName: "license_list",
	details_fragment: getHRDocsDashboardFragment("license_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Licenses",
	listName: "license_list",
	details_fragment: getDateRangeDashboardFragment("license_list"),
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
				notes,
				expiry_date,
				doc,
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
			notes,
			expiry_date: Dates.formatDate(expiry_date),
			doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));
