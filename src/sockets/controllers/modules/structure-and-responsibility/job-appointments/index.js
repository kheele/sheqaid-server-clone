const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	findByIdCompanyDashboardStats,
	findByIdClientDashboardStats,
	findByIdProjectDashboardStats,
	findByIdSiteDashboardStats,
	findByIdContractorDashboardStats
} = require("../../employees/docs/dashboardImpl");
const {findByIdEmployeeDashboardStats} = require("../../findByIdEmployeeDashboardStatsImpl");
const {
	findByIdCompanyDateRangeDashboardStats,
	findByIdClientDateRangeDashboardStats,
	findByIdProjectDateRangeDashboardStats,
	findByIdSiteDateRangeDashboardStats,
	findByIdContractorDateRangeDashboardStats
} = require("../../employees/docs/dateRangeDashboardImpl");
const {findByIdEmployeeDateRangeDashboardStats} = require("../../findByIdEmployeeDateRangeDashboardStatsImpl");

eventManager.on("structure-and-responsibility/job-appointments/findById", findByIdImpl);

eventManager.on("structure-and-responsibility/job-appointments/listByLogged", listImpl);

eventManager.on(`structure-and-responsibility/job-appointments/dashboard`, findByIdEmployeeDashboardStats({
	name: "JobAppointments",
	listName: "job_appointment_list",
}));

eventManager.on(`structure-and-responsibility/job-appointments/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "JobAppointments",
	listName: "job_appointment_list",
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`structure-and-responsibility/job-appointments/${org}/dashboard`, fn({
		name: "JobAppointments",
		listName: "job_appointment_list",
	}));
});

[
	{org: "company", fn: findByIdCompanyDateRangeDashboardStats},
	{org: "client", fn: findByIdClientDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`structure-and-responsibility/job-appointments/${org}/dashboard/date-range`, fn({
		name: "JobAppointments",
		listName: "job_appointment_list",
	}));
});
