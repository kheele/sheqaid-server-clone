require('./courses');
require('./matrix');
require('./plans');
require('./register');
require('./toolbox-talks');

const {
	findByIdCompanyTrainingsDashboardStats,
	findByIdClientTrainingsDashboardStats,
	findByIdProjectTrainingsDashboardStats,
	findByIdSiteTrainingsDashboardStats,
	findByIdContractorTrainingsDashboardStats
} = require("./findByIdOrgTrainingsDashboardStatsImpl");

[
	{org: "company", fn: findByIdCompanyTrainingsDashboardStats},
	{org: "client", fn: findByIdClientTrainingsDashboardStats},
	{org: "project", fn: findByIdProjectTrainingsDashboardStats},
	{org: "site", fn: findByIdSiteTrainingsDashboardStats},
	{org: "contractor", fn: findByIdContractorTrainingsDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`trainings/${org}/dashboard`, fn());
});
