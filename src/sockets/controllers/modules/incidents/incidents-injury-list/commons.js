
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		name,
		type,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

	if (name) {
		filter.push(`name: {_eq: "${name}"}`);
	}

	if (type) {
		filter.push(`type: {_eq: "${type}"}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="incident_injury_list_details_fragment">
exports.incident_injury_list_details_fragment = `
  id
  name
  type
`;
//</editor-fold>
