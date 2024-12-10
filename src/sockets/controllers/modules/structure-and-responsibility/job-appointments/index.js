const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../../employees/docs/hrDocsDashboardImpl");
const {findByIdEmployeeDashboardStats} = require("../../findByIdEmployeeDashboardStatsImpl");
const {
	getDateRangeDashboardFragment
} = require("../../employees/docs/hrDocsDateRangeDashboardImpl");
const {findByIdEmployeeDateRangeDashboardStats} = require("../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../findByIdOrgDashboardStatsImpl");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../findByIdOrgDateRangeDashboardStatsImpl");

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

eventManager.on(`structure-and-responsibility/job-appointments/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "JobAppointments",
	listName: "job_appointment_list",
	details_fragment: getHRDocsDashboardFragment("job_appointment_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`structure-and-responsibility/job-appointments/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "JobAppointments",
	listName: "job_appointment_list",
	details_fragment: getDateRangeDashboardFragment("job_appointment_list"),
}));