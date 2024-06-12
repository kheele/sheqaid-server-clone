const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	findByIdEmployeeDashboardStats,
	//
	findByIdCompanyDashboardStats,
	findByIdClientDashboardStats,
	findByIdProjectDashboardStats,
	findByIdSiteDashboardStats,
	findByIdContractorDashboardStats
} = require("../dashboardImpl");

const {
	findByIdCompanyDateRangeDashboardStats,
	findByIdClientDateRangeDashboardStats,
	findByIdProjectDateRangeDashboardStats,
	findByIdSiteDateRangeDashboardStats,
	findByIdContractorDateRangeDashboardStats,
} = require("../dateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");

eventManager.on("employees/docs/medicals/findById", findByIdImpl);

eventManager.on("employees/docs/medicals/listByLogged", listImpl);

eventManager.on(`employees/docs/medicals/dashboard`, findByIdEmployeeDashboardStats({
	name: "Medicals",
	listName: "medical_list"
}));

eventManager.on(`employees/docs/medicals/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "Medicals",
	listName: "medical_list"
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/medicals/${org}/dashboard`, fn({
		name: "Medicals",
		listName: "medical_list"
	}));
});

[
	{org: "company", fn: findByIdCompanyDateRangeDashboardStats},
	{org: "client", fn: findByIdClientDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/medicals/${org}/dashboard/date-range`, fn({
		name: "Medicals",
		listName: "medical_list"
	}));
});
