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
const {createWorkPermit} = require("./create");

const args = {
	name: 'Work-Permits',
	tbl: 'hr_employees_docs_work_permits',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/work-permits/${id}/Work-Permit-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
		key: 'doc',
	}),
};

const path = `employees/docs/work-permits`;

eventManager.on(`${path}/create`, createWorkPermit);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`employees/docs/work-permits/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "WorkPermits",
	listName: "work_permit_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/work-permits/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "WorkPermits",
	listName: "work_permit_list"
}));

eventManager.on(`employees/docs/work-permits/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "WorkPermits",
	listName: "work_permit_list",
	details_fragment: getHRDocsDashboardFragment("work_permit_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/work-permits/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "WorkPermits",
	listName: "work_permit_list",
	details_fragment: getDateRangeDashboardFragment("work_permit_list"),
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
