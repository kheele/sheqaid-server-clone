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
	name: 'Medical',
	tbl: 'hr_employees_docs_medicals',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/medicals/${id}/Medical-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/medicals`;

eventManager.on(`${path}/create`, createImpl(args));

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