//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="manual_details_fragment">
const manual_details_fragment = `
    id
    name
    desc
    site_url
    photo
`;
exports.manual_details_fragment = manual_details_fragment;
//</editor-fold>
