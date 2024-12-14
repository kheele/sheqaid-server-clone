const findByIdImpl = require("../../../../findByIdImpl");
const listHRDocsByLogged = require('./listHRDocsByLogged');

const {
	getPersonalDocumentsDashboardFragment, personalDocumentsMapResults
} = require("../personalDocsDashboardImpl");

const {findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl} = require("../personalDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../../findByIdEmployeeDashboardStatsImpl");
const {inc_fragment} = require("./commons");
const createImpl = require("../../../../createImpl");
const updateImpl = require("../../../../updateImpl");

const args = {
	name: 'PrDP',
	tbl: 'hr_employees_documents',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/documents/prdp`;

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP",
	mapResults: id => res => res && res.data,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "PrDP",
	type: "PrDP",
	details_fragment: getPersonalDocumentsDashboardFragment("PrDP"),
	mapResults: personalDocumentsMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl({
	name: "PrDP",
	type: "PrDP"
}));