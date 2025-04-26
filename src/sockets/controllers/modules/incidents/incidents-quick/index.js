const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const findByIdDashboardImpl = require('./findByIdDashboardImpl');
const exportExcelImpl = require("../../exportExcelImpl2");
const {mapExportRow} = require("./incidents_quick_funcs");
const {incident_quick_details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "QuickIncidents",
	tbl: "sheq_incident_investigation_quick",
	details_fragment: incident_quick_details_fragment,
	order_by: `order_by: {incident_date: desc}`,
	getVariablesAndQueryConfig,
};

const path = 'incidents-quick';

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/dashboard`, findByIdDashboardImpl);

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: mapExportRow,
}));
