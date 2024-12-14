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
	name: 'IDOrPassport',
	tbl: 'hr_employees_documents',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/documents/id-or-passports`;

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "IDOrPassport",
	listName: "document_list",
	type: "ID/Passport",
	mapResults: id => res => res && res.data,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "IDOrPassport",
	listName: "document_list",
	type: "ID/Passport"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "IDOrPassport",
	type: "ID/Passport",
	details_fragment: getPersonalDocumentsDashboardFragment("ID/Passport"),
	mapResults: personalDocumentsMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl({
	name: "IDOrPassport",
	type: "ID/Passport"
}));