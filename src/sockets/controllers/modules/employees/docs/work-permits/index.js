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

eventManager.on("employees/docs/work-permits/findById", findByIdImpl);

eventManager.on("employees/docs/work-permits/listByLogged", listImpl);

eventManager.on(`employees/docs/work-permits/dashboard`, findByIdEmployeeDashboardStats({
	name: "WorkPermits",
	listName: "work_permit_list"
}));

eventManager.on(`employees/docs/work-permits/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "WorkPermits",
	listName: "work_permit_list"
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/work-permits/${org}/dashboard`, fn({
		name: "WorkPermits",
		listName: "work_permit_list"
	}));
});

[
	{org: "company", fn: findByIdCompanyDateRangeDashboardStats},
	{org: "client", fn: findByIdClientDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/docs/work-permits/${org}/dashboard/date-range`, fn({
		name: "WorkPermits",
		listName: "work_permit_list"
	}));
});
