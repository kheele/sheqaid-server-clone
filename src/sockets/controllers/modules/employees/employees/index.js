const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");
const listByPPEIssueImpl = require("./listByPPEIssueImpl");

eventManager.on("employees/findById", findByIdImpl);

eventManager.on("employees/listByLogged", listImpl);

eventManager.on("employees/listByPPEIssue", listByPPEIssueImpl);

const {
	findByIdCompanyHRDashboardStats,
	findByIdClientHRDashboardStats,
	findByIdProjectHRDashboardStats,
	findByIdSiteHRDashboardStats,
	findByIdContractorHRDashboardStats
} = require("./findByIdOrgHRDashboardStatsImpl");

[
	{org: "company", fn: findByIdCompanyHRDashboardStats},
	{org: "client", fn: findByIdClientHRDashboardStats},
	{org: "project", fn: findByIdProjectHRDashboardStats},
	{org: "site", fn: findByIdSiteHRDashboardStats},
	{org: "contractor", fn: findByIdContractorHRDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/${org}/dashboard`, fn());
});
