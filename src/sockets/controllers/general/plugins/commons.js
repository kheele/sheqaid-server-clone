//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		id,
		//
		title,
		key,
		status,
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
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

exports.details_fragment_plugins = `
		id
        app
        desc
        key
        status
        title
        module_list(order_by: [{sort: asc}]) {
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
        }
	`;