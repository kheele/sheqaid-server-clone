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
const {inc_fragment} = require("./commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");

eventManager.on("employees/docs/contracts/update", updateImpl({
	name: 'Competency',
	tbl: 'hr_employees_docs_competencies',
	details_fragment: inc_fragment,
	uploadUpdate: ({employee, id}) => ({
		new_name: `employees/${employee.id}/docs/contracts/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
}));

eventManager.on("employees/docs/contracts/findById", findByIdImpl);

eventManager.on("employees/docs/contracts/listByLogged", listImpl);

eventManager.on(`employees/docs/contracts/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Contracts",
	listName: "contract_list",
	mapResults: hrDocsDashboardMapResults,
	isContract: true,
}));

eventManager.on(`employees/docs/contracts/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Contracts",
	listName: "contract_list",
	isContract: true,
}));

eventManager.on(`employees/docs/contracts/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Contracts",
	listName: "contract_list",
	details_fragment: getHRDocsDashboardFragment("contract_list", true),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/contracts/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Contracts",
	listName: "contract_list",
	details_fragment: getDateRangeDashboardFragment("contract_list", true),
}));