//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		id,
		//
		title,
		key,
		status,
		plugin_status,
		plugin_key,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (title) {
			filter.push(`title: {_ilike: "%${title}%"}`);
		}

		if (key) {
			filter.push(`key: {_eq: "${key}"}`);
		}

		if (status) {
			filter.push(`status: {_eq: "${status}"}`);
		}

		if (plugin_status) {
			filter.push(`plugin:{status: {_eq: "${plugin_status}"}}`);
		}

		if (plugin_key) {
			let eq;
			if(plugin_key.startsWith("!")) {
				eq = "_neq";
				plugin_key = plugin_key.substring(1);
			} else {
				eq = "_eq";
			}
			filter.push(`plugin:{key: {${eq}: "${plugin_key}"}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

exports.details_fragment_modules = `
  id
  borderColor
  desc
  discount
  faIconLeft
  faIconRight
  has_update
  hover
  key
  price
  sort
  status
  svgIconLeft
  svgIconRight
  title
  plugin {
  	key
  }
`;