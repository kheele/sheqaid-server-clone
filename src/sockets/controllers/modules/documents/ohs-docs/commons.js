
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		type,
		title,
		module,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(type) {
			filter.push(`type: {_eq: "${type}"}`);
		}
		if(title) {
			filter.push(`title: {_ilike: "%${title}%"}`);
		}
		if(module) {
			filter.push(`module_list: {module:{key: {_eq: "${module}"}}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ohs_docs_details_fragment">
exports.ohs_docs_details_fragment = `
  id
  module_list{
	id
	module{
		id
		key
		title
		desc
		status
		sort
		manager_plugin_id
	}
  }
  type
  title
  desc
  doc
`;
//</editor-fold>
