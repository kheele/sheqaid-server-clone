//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		key,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (key) {
			filter.push(`key: {_eq: "${key}"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="settings_categories_details_fragment">
const settings_categories_details_fragment = `
    id
    key
`;
exports.settings_categories_details_fragment = settings_categories_details_fragment;
//</editor-fold>
