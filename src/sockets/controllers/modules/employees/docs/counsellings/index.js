const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../hrDocsDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const updateImpl = require("../../../updateImpl");
const {inc_fragment} = require("../competencies/commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {getDateRangeDashboardFragment} = require("../hrDocsDateRangeDashboardImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");

eventManager.on("employees/docs/competencies/update", updateImpl({
	name: 'Competency',
	tbl: 'hr_employees_docs_competencies',
	details_fragment: inc_fragment,
	uploadUpdate: ({employee, id}) => ({
		new_name: `employees/${employee.id}/docs/competencies/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
}));

eventManager.on("employees/docs/counsellings/findById", findByIdImpl);

eventManager.on("employees/docs/counsellings/listByLogged", listImpl);

eventManager.on(`employees/docs/counsellings/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Counselings",
	listName: "counselling_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/counsellings/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Counselings",
	listName: "counselling_list"
}));

eventManager.on(`employees/docs/counsellings/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Counselings",
	listName: "counselling_list",
	details_fragment: getHRDocsDashboardFragment("counselling_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/counsellings/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Counselings",
	listName: "counselling_list",
	details_fragment: getDateRangeDashboardFragment("counselling_list"),
}));