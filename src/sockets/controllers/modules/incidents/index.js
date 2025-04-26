require('./cause-analysis');
require('./corrective-actions');
require('./incidents-injury-list');
require('./incidents-quick');
require('./investigations');
require('./proxy');

const {createIncident} = require("./create");
const findByIdImpl = require("../findByIdImpl");
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const exportExcelImpl = require("../exportExcelImpl2");
const exportExcelOneImpl = require("../exportExcelOneImpl");
const {mapExportRow} = require("./incidents_funcs");
const {incident_details_fragment, incident_details_export_fragment, getVariablesAndQueryConfig} = require("./commons");
const listByLoggedImpl = require("../listByLoggedImpl");

const args = {
	name: "Incidents",
	tbl: "sheq_incident_investigation",
	details_fragment: incident_details_fragment,
	order_by: `order_by: {incident_date: desc}`,
	getVariablesAndQueryConfig,
};

const path = 'incidents';

eventManager.on(`${path}/create`, createIncident);

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/dashboard`, findByIdDashboardImpl);

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	details_fragment: incident_details_export_fragment,
	currDir: __dirname,
	mapRow: mapExportRow,
}));

eventManager.on(`${path}/export-excel-one`, exportExcelOneImpl({
	currDir: __dirname,
	name: "Incident-Single",
	findByIdImpl,
	mapRow: mapExportRow,
}));