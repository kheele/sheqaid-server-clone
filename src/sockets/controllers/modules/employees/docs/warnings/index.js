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
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const createImpl = require("../../../createImpl");

const args = {
	name: 'Warning',
	tbl: 'hr_employees_docs_warnings',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/warnings`;

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`employees/docs/warnings/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Warnings",
	listName: "warning_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/warnings/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Warnings",
	listName: "warning_list"
}));

eventManager.on(`employees/docs/warnings/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Warnings",
	listName: "warning_list",
	details_fragment: getHRDocsDashboardFragment("warning_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/warnings/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Warnings",
	listName: "warning_list",
	details_fragment: getDateRangeDashboardFragment("warning_list"),
}));