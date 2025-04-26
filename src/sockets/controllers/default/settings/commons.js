//<editor-fold desc="getVariablesAndQueryConfig">
const { user_personal_details_fragment} = require("../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		settings_user_id,
		settings_category_id,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (settings_user_id) {
			filter.push(`settings_user_id: {_eq: ${settings_user_id}}`);
		}
		if (settings_category_id) {
			filter.push(`settings_category_id: {_eq: ${settings_category_id}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="settings_details_fragment">
const settings_details_fragment = `
    id
    settings_user{
    	${user_personal_details_fragment}
    }
    settings_category{
    	id
    	key
    }
`;
exports.settings_details_fragment = settings_details_fragment;
//</editor-fold>
