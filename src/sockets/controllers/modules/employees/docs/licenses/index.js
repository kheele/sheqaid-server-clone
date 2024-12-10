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
const {inc_fragment} = require("../competencies/commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
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

eventManager.on("employees/docs/licenses/findById", findByIdImpl);

eventManager.on("employees/docs/licenses/listByLogged", listImpl);

eventManager.on(`employees/docs/licenses/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Licenses",
	listName: "license_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/licenses/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Licenses",
	listName: "license_list"
}));

eventManager.on(`employees/docs/licenses/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Licenses",
	listName: "license_list",
	details_fragment: getHRDocsDashboardFragment("license_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/licenses/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Licenses",
	listName: "license_list",
	details_fragment: getDateRangeDashboardFragment("license_list"),
}));