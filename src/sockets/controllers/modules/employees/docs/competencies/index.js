const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
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

eventManager.on("employees/docs/competencies/update", updateImpl({
	name: 'Competency',
	tbl: 'hr_employees_docs_competencies',
	details_fragment: inc_fragment,
	uploadUpdate: ({employee, id}) => ({
		new_name: `employees/${employee.id}/docs/competencies/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
}));

eventManager.on("employees/docs/competencies/findById", findByIdImpl);

eventManager.on("employees/docs/competencies/listByLogged", listImpl);

eventManager.on(`employees/docs/competencies/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Competencies",
	listName: "competency_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/competencies/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Competencies",
	listName: "competency_list"
}));

eventManager.on(`employees/docs/competencies/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Competencies",
	listName: "competency_list",
	details_fragment: getHRDocsDashboardFragment("competency_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/competencies/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Competencies",
	listName: "competency_list",
	details_fragment: getDateRangeDashboardFragment("competency_list"),
}));
//74