const findByIdImpl = require("../../../findByIdImpl");
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
const createImpl = require("../../../createImpl");

const args = {
	name: 'Work-Permit',
	tbl: 'hr_employees_docs_work_permits',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/work-permits/${id}/Work-Permit-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/work-permits`;

eventManager.on(`${path}/create`, createImpl(args));

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