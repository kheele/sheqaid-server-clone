const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	findByIdEmployeeDashboardStats,
	//
	findByIdCompanyDashboardStats,
	findByIdClientDashboardStats,
	findByIdProjectDashboardStats,
	findByIdSiteDashboardStats,
	findByIdContractorDashboardStats,
} = require("../dashboardImpl");
const updateImpl = require("../../../updateImpl");

const {
	findByIdCompanyDateRangeDashboardStats,
	findByIdClientDateRangeDashboardStats,
	findByIdProjectDateRangeDashboardStats,
	findByIdSiteDateRangeDashboardStats,
	findByIdContractorDateRangeDashboardStats,
} = require("../dateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {inc_fragment} = require("./commons");

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

eventManager.on(`employees/docs/competencies/dashboard`, findByIdEmployeeDashboardStats({
	name: "Competencies",
	listName: "competency_list"
}));

eventManager.on(`employees/docs/competencies/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "Competencies",
	listName: "competency_list"
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/competencies/${org}/dashboard`, fn({
		name: "Competencies",
		listName: "competency_list"
	}));
});

[
	{org: "company", fn: findByIdCompanyDateRangeDashboardStats},
	{org: "client", fn: findByIdClientDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/competencies/${org}/dashboard/date-range`, fn({
		name: "Competencies",
		listName: "competency_list"
	}));
});
