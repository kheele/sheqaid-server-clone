const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {settings_categories_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "NotificationSettingsCategory",
	tbl: "settings_categories",
	details_fragment,
	orgs_fragment: null,
};

const path = "notification-settings-categories";

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listAll`, async (socket) => {
	return [
		{key: 'receive_asset_management_notifs', text: 'Asset Management'},
		{key: 'receive_chemicals_management_notifs', text: 'Chemicals Management'},
		{key: 'receive_contractor_management_notifs', text: 'Contractor Management'},
		{key: 'receive_employees_expired_docs_medicals', text: 'Employee Expired Documents'},
		{key: 'receive_employees_profile_notifs', text: 'Employee Profile'},
		{key: 'receive_incident_management_notifs', text: 'Incident Management'},
		{key: 'receive_inspection_management_notifs', text: 'Inspection Management'},
		{key: 'receive_non_conformance_management_notifs', text: 'None-Conformance Management'},
		{key: 'receive_training_management_notifs', text: 'Training Management'},
		{key: 'receive_expired_docs_notifs', text: 'Expired Documents'},
	];
});
//
