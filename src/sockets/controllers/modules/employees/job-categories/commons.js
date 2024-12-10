
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        job_category_owner,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
        exact_orgs_company = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
        if (job_category_owner) {
            filter.push(`job_category_owner: {_eq: "${job_category_owner}"}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>
