//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		id,
		//
		title,
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
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>
