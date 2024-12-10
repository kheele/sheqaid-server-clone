const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");
const listByPPEIssueImpl = require("./listByPPEIssueImpl");
const {findByIdOrgHRDashboardStatsImpl} = require("./findByIdOrgHRDashboardStatsImpl");

eventManager.on("employees/findById", findByIdImpl);

eventManager.on("employees/listByLogged", listImpl);

eventManager.on("employees/listByPPEIssue", listByPPEIssueImpl);

eventManager.on(`employees/dashboard`, findByIdOrgHRDashboardStatsImpl());