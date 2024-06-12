
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        // status,

        //
      logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    // if (status) {
    // 	let comp;
    // 	if (status.startsWith('!')) {
    // 		status = status.replace('!', '');
    // 		comp = '_neq';
    // 	} else {
    // 		comp = '_eq';
    // 	}
    //
    // 	filter.push(`status: {${comp}: "${status}"}`);
    // }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>
