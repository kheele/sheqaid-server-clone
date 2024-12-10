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

eventManager.on("employees/docs/medicals/findById", findByIdImpl);

eventManager.on("employees/docs/medicals/listByLogged", listImpl);

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