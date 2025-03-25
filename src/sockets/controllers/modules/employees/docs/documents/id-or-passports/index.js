const findByIdImpl = require("../../../../findByIdImpl");
const exportExcelImpl = require("../../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');

const {
	getPersonalDocumentsDashboardFragment, personalDocumentsMapResults
} = require("../personalDocsDashboardImpl");

const {findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl} = require("../personalDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../../findByIdEmployeeDashboardStatsImpl");
const {inc_fragment} = require("./commons");
const updateImpl = require("../../../../updateImpl");
const {createIDOrPassport} = require("./create");

const args = {
	name: 'IDOrPassports',
	tbl: 'hr_employees_documents',
	details_fragment: inc_fragment({inc_employee: true}),
	orgs_fragment: null,
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/documents/id-or-passports`;

eventManager.on(`${path}/create`, createIDOrPassport);

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

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				project,
				site,
				employee,
				type,
				expiry_date,
				doc,
				removed,
			}
		} = item;

		return {
			idx: idx + 1,
			id,

			project: project && project.name,
			site: site && site.name,

			full_name: employee && employee.full_name,
			id_or_passport: employee && (employee.id_num || employee.passport_num),
			job_position: employee && employee.job_position && employee.job_position.name,
			employment_num: employee && employee.employment_num,

			type,
			expiry_date: Dates.formatDate(expiry_date),
			doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));
