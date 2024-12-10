const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
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

eventManager.on("employees/docs/work-permits/update", updateImpl({
	name: 'Work-Permit',
	tbl: 'hr_employees_docs_work_permits',
	details_fragment: inc_fragment,
	uploadUpdate: ({employee, id}) => ({
		new_name: `employees/${employee.id}/docs/work-permits/${id}/Work-Permit-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
}));

eventManager.on("employees/docs/work-permits/findById", findByIdImpl);

eventManager.on("employees/docs/work-permits/listByLogged", listImpl);

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